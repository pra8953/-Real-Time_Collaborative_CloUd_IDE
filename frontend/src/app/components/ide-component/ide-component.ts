import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../core/services/file';
import { SocketService } from '../../core/services/socket.services';
import { Authservices } from '../../core/services/authservices';
import { Subject } from 'rxjs';
import { ProjectService } from '../../core/services/project';

declare const monaco: any;

interface File {
  _id: string;
  name: string;
  content: string;
  language: string;
  unsavedChanges?: boolean;
}

interface User {
  userId: string;
  username: string;
  socketId: string;
}

interface CursorPosition {
  line: number;
  column: number;
}

interface CursorData {
  userId: string;
  username: string;
  cursor: CursorPosition;
  selection?: any;
}

interface ContentUpdate {
  changeId: string;
  userId: string;
  fileId: string;
  changes: any;
  fullContent?: string;
}

@Component({
  selector: 'app-ide-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ide-component.html',
  styleUrls: ['./ide-component.css'],
})
export class IdeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;
  @ViewChild('fileNameInput', { static: false }) fileNameInput!: ElementRef;
  route = inject(ActivatedRoute);
  private editor: any;
  private monacoLoaded = false;
  private monacoLoadPromise: Promise<void> | null = null;
  private previewWindow: Window | null = null;

  // Editor state
  code: string = '';
  files: File[] = [];
  selectedFile: File | null = null;
  private originalContent: string = '';

  // File operations
  isCreatingFile: boolean = false;
  newFileName: string = 'new-file.html';

  // Collaboration properties
  private collaborators = new Map<string, any>();
  public collaboratorsArray: any[] = []; // userId -> collaborator data
  private remoteCursors = new Map<string, any>(); // userId -> cursor decoration
  private isRemoteUpdate = false; // Prevent update loops

  // User info from auth
  private currentUserId: string = '';
  private currentUsername: string = '';

  // Sample initial files
  private initialFiles: File[] = [
    {
      _id: '1',
      name: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to My Website</h1>
        <p>Start editing this HTML file to build your project!</p>
        <button onclick="showAlert()">Click Me</button>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`,
      language: 'html',
    },
    {
      _id: '2',
      name: 'styles.css',
      content: `/* Main Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
`,
      language: 'css',
    },
    {
      _id: '3',
      name: 'script.js',
      content: `// JavaScript File
console.log('🚀 Script loaded successfully!');

`,
      language: 'javascript',
    },
  ];

  ngOnInit() {
    this.getCurrentUserInfo();
    this.initializeCollaboration();
    this.loadFiles();
    this.loadMonacoEditor();
    this.handleInviteToken();
  }

  ngAfterViewInit() {
    // Editor will be initialized when monaco is loaded
  }

  ngOnDestroy() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.socketService.leaveProject(projectId);
    }

    if (this.editor) {
      this.editor.dispose();
    }
    if (this.previewWindow && !this.previewWindow.closed) {
      this.previewWindow.close();
    }
  }

  constructor(
    private fileservices: FileService,
    private socketService: SocketService,
    private authService: Authservices,
    private projectService: ProjectService
  ) {}

  // ✅ OPEN BROWSER PREVIEW IN NEW TAB
  openBrowserPreview() {
    if (!this.selectedFile) {
      this.showNotification('Please select a file first!', 'error');
      return;
    }

    const previewContent = this.generatePreviewContent();
    const blob = new Blob([previewContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Open in new tab
    this.previewWindow = window.open(
      url,
      '_blank',
      'width=1200,height=800,scrollbars=yes,resizable=yes'
    );

    if (this.previewWindow) {
      this.previewWindow.focus();
      this.showNotification('Preview opened in new tab!', 'success');
    } else {
      this.showNotification('Popup blocked! Please allow popups for this site.', 'error');
    }
  }

  // ✅ GENERATE PREVIEW CONTENT
  private generatePreviewContent(): string {
    if (!this.selectedFile) return '';

    const fileName = this.selectedFile.name.toLowerCase();

    if (fileName.endsWith('.html')) {
      return this.code;
    } else if (fileName.endsWith('.css')) {
      return this.getCSSPreview(this.code, this.selectedFile.name);
    } else if (fileName.endsWith('.js')) {
      return this.getJSPreview(this.code, this.selectedFile.name);
    } else {
      return this.getTextPreview(this.code, this.selectedFile.name);
    }
  }

  // ✅ LOAD MONACO EDITOR
  private async loadMonacoEditor(): Promise<void> {
    // if (this.monacoLoaded) return;
    if (this.monacoLoadPromise) {
      return this.monacoLoadPromise;
    }

    this.monacoLoadPromise = new Promise((resolve, reject) => {
      if (this.monacoLoaded) {
        resolve();
        return;
      }

      // ✅ Check if Monaco already loaded
      if (typeof monaco !== 'undefined') {
        this.monacoLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';

      script.onload = () => {
        (window as any).require.config({
          paths: {
            vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs',
          },
        });

        (window as any).require(
          ['vs/editor/editor.main'],
          () => {
            this.monacoLoaded = true;
            resolve();
          },
          (error: any) => {
            console.error('❌ Monaco main load failed:', error);
            reject(error);
          }
        );
      };

      script.onerror = (error) => {
        console.error('❌ Monaco loader failed to load:', error);
        reject(new Error('Failed to load Monaco Editor'));
      };

      // ✅ Add to head for better loading
      document.head.appendChild(script);
    });

    return this.monacoLoadPromise;
  }

  private loadMonacoScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof monaco !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
      script.onload = () => {
        (window as any).require.config({
          paths: {
            vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs',
          },
        });

        (window as any).require(
          ['vs/editor/editor.main'],
          () => {
            resolve();
          },
          (error: any) => {
            reject(error);
          }
        );
      };

      script.onerror = () => {
        reject(new Error('Failed to load Monaco Editor'));
      };

      document.head.appendChild(script);
    });
  }

  // ✅ INITIALIZE EDITOR
  private initializeEditor(): void {
    if (!this.editorContainer || !this.monacoLoaded) return;

    try {
      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.code,
        language: this.getLanguageFromExtension(this.selectedFile?.name || 'html'),
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        folding: true,
        wordWrap: 'on',
        formatOnType: true,
        formatOnPaste: true,
        suggestOnTriggerCharacters: true,
        autoIndent: 'full',
        tabSize: 2,
        insertSpaces: true,
        detectIndentation: true,
        roundedSelection: true,
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          useShadows: false,
        },
      });

      // Add cursor movement tracking
      this.editor.onDidChangeCursorPosition((e: any) => {
        if (this.selectedFile && this.currentUserId) {
          this.socketService.sendCursorMove(
            {
              line: e.position.lineNumber - 1,
              column: e.position.column - 1,
            },
            this.editor.getSelection()
          );
        }
      });

      // Add content change tracking
      this.editor.onDidChangeModelContent((e: any) => {
        const newCode = this.editor.getValue();

        console.log('📝 EDITOR CONTENT CHANGED - SENDING TO SERVER:', {
          changesCount: e.changes.length,
          newCodeLength: newCode.length,
          selectedFile: this.selectedFile?.name,
          selectedFileId: this.selectedFile?._id,
          isRemoteUpdate: this.isRemoteUpdate,
        });

        this.code = newCode;
        this.updateUnsavedChanges();

        if (this.selectedFile && !this.isRemoteUpdate) {
          console.log('🚀 SENDING CONTENT-CHANGE EVENT TO SERVER:', {
            fileId: this.selectedFile._id,
            file: this.selectedFile.name,
            changesCount: e.changes.length,
            fullContentLength: this.code.length,
            socketConnected: this.socketService.getConnectionStatus(),
          });

          // Send content changes to other users
          this.socketService.sendContentChange(
            this.selectedFile._id,
            e.changes, // Monaco change events
            this.code // Full content as fallback
          );
        }
      });

      // Handle editor layout
      window.addEventListener('resize', () => {
        if (this.editor) {
          this.editor.layout();
        }
      });
    } catch (error) {
      console.error('❌ Error initializing Monaco Editor:', error);
    }
  }

  // ✅ UPDATE EDITOR CONTENT AND LANGUAGE
  private updateEditor(content: string, language: string): void {
    if (this.editor) {
      const model = this.editor.getModel();
      monaco.editor.setModelLanguage(model, language);
      this.editor.setValue(content);
    } else if (this.monacoLoaded) {
      this.initializeEditor();
    }
  }

  loadFiles() {
    const projectId = this.route.snapshot.paramMap.get('id');

    this.fileservices.getfiles(projectId).subscribe({
      next: (res) => {
        console.log('API:', res);
        this.files = res.data; // ✔ Correct

        if (this.files.length > 0) {
          this.selectFile(this.files[0]);
        }
      },
      error: () => {
        this.showNotification('Failed to load project files', 'error');
      },
    });
  }

  selectFile(file: File) {
    // Check for unsaved changes
    if (this.hasUnsavedChanges() && this.selectedFile) {
      const confirmChange = confirm(
        `You have unsaved changes in ${this.selectedFile.name}. Do you want to continue without saving?`
      );
      if (!confirmChange) {
        return;
      }
    }

    this.selectedFile = file;
    this.code = file.content || '';
    this.originalContent = file.content || '';

    const language = this.getLanguageFromExtension(file.name);

    // Ensure Monaco is loaded before updating editor
    if (!this.monacoLoaded) {
      this.loadMonacoEditor().then(() => {
        setTimeout(() => this.updateEditor(this.code, language), 100);
      });
    } else {
      this.updateEditor(this.code, language);
    }
  }

  createFile() {
    this.isCreatingFile = true;
    this.newFileName = 'new-file.html';

    setTimeout(() => {
      if (this.fileNameInput) {
        this.fileNameInput.nativeElement.focus();
        this.fileNameInput.nativeElement.select();
      }
    }, 100);
  }

  confirmCreateFile() {
    if (!this.newFileName.trim()) {
      this.showNotification('Please enter a file name', 'error');
      return;
    }

    const projectId = this.route.snapshot.paramMap.get('id');

    const payload = {
      name: this.newFileName,
      content: this.getDefaultContent(this.newFileName),
      language: this.getLanguageFromExtension(this.newFileName),
      project: projectId,
    };

    this.fileservices.addfile(payload).subscribe({
      next: (res) => {
        if (!res.file || !res.file._id) {
          console.error('❌ File object missing _id:', res.file);
          this.showNotification('File created but response format error', 'warning');
          return;
        }

        this.showNotification('File created successfully!', 'success');

        // Close dialog box
        this.isCreatingFile = false;
        this.newFileName = '';

        const newFile = {
          _id: res.file._id,
          name: res.file.name || payload.name,
          content: res.file.content || payload.content,
          language: res.file.language || payload.language,
          unsavedChanges: false,
        };

        this.files = [...this.files, newFile];

        setTimeout(() => {
          this.selectFile(newFile);
        }, 200);
      },
      error: (err) => {
        this.showNotification('File creation failed!', 'error');
        console.error(err);
        this.isCreatingFile = false;
        this.newFileName = '';
      },
    });
  }

  cancelCreateFile() {
    this.isCreatingFile = false;
    this.newFileName = '';
  }

  deleteFile(file: File, event: Event) {
    console.log('Deleting file:', file);
    event.stopPropagation(); // ✔️ Click selectFile ko trigger nahi karega

    if (!confirm('Are you sure you want to delete this file?')) return;

    // ✅ Use file._id directly from the file object
    this.fileservices.deleteFile(file._id).subscribe({
      next: () => {
        // UI se remove
        this.files = this.files.filter((f) => f._id !== file._id);

        // Agar deleted file open thi to reset
        if (this.selectedFile?._id === file._id) {
          this.selectedFile = null;
          this.code = '';
          this.originalContent = '';
        }

        this.showNotification('File deleted successfully!', 'success');
      },
      error: (error) => {
        console.error('Delete error:', error);
        this.showNotification('Failed to delete file', 'error');
      },
    });
  }

  // ✅ EDITOR ACTIONS - UPDATED SAVE METHOD
  hasUnsavedChanges(): boolean {
    return this.selectedFile ? this.code !== this.originalContent : false;
  }

  updateUnsavedChanges() {
    if (this.selectedFile) {
      this.selectedFile.unsavedChanges = this.hasUnsavedChanges();
    }
  }

  // ✅ UPDATED SAVE METHOD WITH API CALL
  saveFile() {
    if (this.selectedFile) {
      // Show saving notification
      this.showNotification('Saving file...', 'warning');

      const payload = {
        name: this.selectedFile.name,
        content: this.code,
        language: this.selectedFile.language,
      };

      // Call updatefile API
      this.fileservices.updatefile(this.selectedFile._id, payload).subscribe({
        next: (res) => {
          // Update local state
          this.selectedFile!.content = this.code;
          this.originalContent = this.code;
          this.updateUnsavedChanges();

          this.showNotification('File saved successfully!', 'success');
          console.log('File saved:', res);
        },
        error: (error) => {
          console.error('Save error:', error);
          this.showNotification('Failed to save file!', 'error');
        },
      });
    } else {
      this.showNotification('No file selected to save!', 'error');
    }
  }

  formatCode() {
    if (this.editor) {
      try {
        this.editor.getAction('editor.action.formatDocument').run();
        this.showNotification('Code formatted successfully!', 'success');
      } catch (error) {
        this.showNotification('Formatting not supported for this file type', 'warning');
      }
    }
  }

  runCode() {
    // Run code opens in browser preview
    this.openBrowserPreview();
  }

  // ✅ UTILITY METHODS
  getLanguageFromExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      html: 'html',
      htm: 'html',
      css: 'css',
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      json: 'json',
      md: 'markdown',
      txt: 'plaintext',
    };

    return languageMap[ext || ''] || 'plaintext';
  }

  getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const icons: { [key: string]: string } = {
      html: '🌐',
      htm: '🌐',
      css: '🎨',
      js: '📜',
      jsx: '⚛️',
      ts: '🔷',
      tsx: '⚛️',
      json: '📋',
      md: '📝',
      txt: '📄',
    };

    return icons[ext || ''] || '📄';
  }

  getDefaultContent(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
    </style>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Start editing your HTML content here...</p>
    
    <script>
        console.log('HTML file loaded successfully!');
    </script>
</body>
</html>`;

      case 'css':
        return `/* ${filename} */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}`;

      case 'js':
        return `// ${filename}
console.log('🚀 JavaScript file loaded!');

function main() {
    console.log('Main function executed');
    // Your code here
}

// Start your application
main();`;

      default:
        return `// ${filename}
// Start coding here...`;
    }
  }

  // Preview generators
  private getCSSPreview(css: string, filename: string): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Preview - ${filename}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px; 
            background: #f5f5f5;
        }
        .preview-container {
            max-width: 600px;
            margin: 0 auto;
        }
        .btn {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px 0;
        }
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin: 10px 0;
        }
        ${css}
    </style>
</head>
<body>
    <div class="preview-container">
        <h1>CSS Preview - ${filename}</h1>
        <button class="btn">Sample Button</button>
        <div class="card">Sample Card Content</div>
        <div class="card">Another Sample Card</div>
    </div>
</body>
</html>`;
  }

  private getJSPreview(js: string, filename: string): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>JS Output - ${filename}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px; 
            background: #f5f5f5;
        }
        .output { 
            background: white; 
            padding: 10px; 
            margin: 10px 0; 
            border-left: 4px solid #007bff;
            border-radius: 4px;
        }
        .error { 
            border-left-color: #dc3545; 
            color: #dc3545;
        }
        .success { 
            border-left-color: #28a745; 
        }
    </style>
</head>
<body>
    <h2>JavaScript Output - ${filename}</h2>
    <div id="output"></div>
    <script>
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const outputDiv = document.getElementById('output');
        
        function addLogEntry(message, type = 'log') {
            const logEntry = document.createElement('div');
            logEntry.className = 'output ' + type;
            logEntry.textContent = '> ' + message;
            outputDiv.appendChild(logEntry);
            outputDiv.scrollTop = outputDiv.scrollHeight;
        }
        
        console.log = function(...args) {
            originalLog.apply(console, args);
            addLogEntry(args.join(' '), 'success');
        };
        
        console.error = function(...args) {
            originalError.apply(console, args);
            addLogEntry(args.join(' '), 'error');
        };
        
        console.warn = function(...args) {
            originalWarn.apply(console, args);
            addLogEntry(args.join(' '), 'warning');
        };
        
        try {
            ${js}
        } catch(error) {
            console.error('❌ Error:', error.message);
        }
    </script>
</body>
</html>`;
  }

  private getTextPreview(content: string, filename: string): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Preview - ${filename}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px; 
            background: #f5f5f5;
        }
        pre { 
            background: white; 
            padding: 15px; 
            border-radius: 5px; 
            border: 1px solid #ddd;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h2>File Preview: ${filename}</h2>
    <pre>${this.escapeHtml(content)}</pre>
</body>
</html>`;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ✅ NOTIFICATION SYSTEM
  private showNotification(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#ff9800';

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }

  // Decode JWT token to get user info
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return { id: 'anonymous', username: 'Anonymous' };
    }
  }

  private getCurrentUserInfo(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = this.decodeToken(token);
        this.currentUserId = userData.id;

        // Better username extraction
        this.currentUsername = userData.username || 'Anonymous';
        console.log('🔐 User info loaded:', {
          id: this.currentUserId,
          username: this.currentUsername,
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        this.currentUserId = 'anonymous';
        this.currentUsername = 'Anonymous';
      }
    } else {
      console.warn('❌ No token found for user info');
    }
  }

  private initializeCollaboration(): void {
    const projectId = this.route.snapshot.paramMap.get('id');

    if (projectId && this.currentUserId) {
      console.log('🚀 Initializing collaboration for project:', projectId);
      console.log('👤 Current user:', this.currentUsername, this.currentUserId);

      if (this.socketService.getConnectionStatus()) {
        this.socketService.joinProject(projectId, this.currentUserId, this.currentUsername);
        this.setupCollaborationListeners();
      } else {
        console.log('⏳ Waiting for socket connection...');
        // Retry after 1 second
        setTimeout(() => {
          this.initializeCollaboration();
        }, 1000);
      }
    } else {
      console.warn('❌ Cannot initialize collaboration - missing data:', {
        projectId,
        userId: this.currentUserId,
        username: this.currentUsername,
      });
    }
  }

  private setupCollaborationListeners(): void {
    // User joined/left events
    this.socketService.onUserJoined.subscribe((user: User) => {
      this.collaborators.set(user.userId, user);
      this.updateCollaboratorsArray();
      this.showNotification(`${user.username} joined the project`, 'success');
    });

    this.socketService.onUserLeft.subscribe((userId: string) => {
      const user = this.collaborators.get(userId);
      if (user) {
        this.showNotification(`${user.username} left the project`, 'warning');
        this.collaborators.delete(userId);
        this.updateCollaboratorsArray();
        this.removeRemoteCursor(userId);
      }
    });

    // Cursor updates
    this.socketService.onCursorUpdate.subscribe((data: CursorData) => {
      console.log('🖱️ Received cursor update from:', data.username);
      this.updateRemoteCursor(data);
    });

    // Content updates
    this.socketService.onContentUpdate.subscribe((data: ContentUpdate) => {
      console.log('📡 Content update received from:', data.userId);
      if (data.userId === this.currentUserId) {
        console.log('🔄 Skipping own update');
        return;
      }
      if (this.selectedFile && data.fileId) {
        // ✅ Convert both to string for reliable comparison
        const localFileId = String(this.selectedFile._id);
        const remoteFileId = String(data.fileId);

        console.log('📁 File ID Comparison:', {
          local: localFileId,
          remote: remoteFileId,
          match: localFileId === remoteFileId,
        });

        if (localFileId === remoteFileId) {
          console.log('✅ Applying remote changes to current file');
          this.applyRemoteContentUpdate(data);
        } else {
          console.log('❌ File ID mismatch - not applying changes');
        }
      } else {
        console.log('⚠️ No selected file or missing fileId');
      }
    });
  }

  private updateCollaboratorsArray(): void {
    this.collaboratorsArray = Array.from(this.collaborators.values());
  }

  private updateRemoteCursor(data: CursorData): void {
    if (!this.editor || data.userId === this.currentUserId) return;
    console.log('🖱️ Updating remote cursor:', data.username, data.cursor);

    // Remove existing cursor
    this.removeRemoteCursor(data.userId);

    try {
      // Convert cursor position (0-based to 1-based for Monaco)
      const lineNumber = data.cursor.line + 1;
      const column = data.cursor.column + 1;

      console.log('📍 Cursor position:', { lineNumber, column });

      // Add new cursor decoration
      const decorations = this.editor.deltaDecorations(
        [],
        [
          {
            range: new monaco.Range(lineNumber, column, lineNumber, column),
            options: {
              className: `remote-cursor remote-cursor-${data.userId}`,
              stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
              hoverMessage: { value: `**${data.username}**` },
            },
          },
        ]
      );

      if (decorations && decorations.length > 0) {
        this.remoteCursors.set(data.userId, {
          decorationId: decorations[0],
          username: data.username,
          userId: data.userId,
        });

        console.log('✅ Cursor added for user:', data.username);
      }
    } catch (error) {
      console.error('❌ Error adding cursor decoration:', error);
    }

    // try {
    //   // Add new cursor decoration with proper position
    //   const position = new monaco.Position(data.cursor.line + 1, data.cursor.column + 1);

    //   const decorations = this.editor.deltaDecorations(
    //     [],
    //     [
    //       {
    //         range: new monaco.Range(
    //           position.lineNumber,
    //           position.column,
    //           position.lineNumber,
    //           position.column
    //         ),
    //         options: {
    //           className: `remote-cursor remote-cursor-${data.userId}`,
    //           stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
    //           hoverMessage: { value: `**${data.username}**` },
    //         },
    //       },
    //     ]
    //   );

    //   if (decorations && decorations.length > 0) {
    //     this.remoteCursors.set(data.userId, {
    //       decorationId: decorations[0],
    //       username: data.username,
    //       userId: data.userId,
    //     });

    //     console.log('✅ Cursor added for user:', data.username);
    //   }
    // } catch (error) {
    //   console.error('❌ Error adding cursor decoration:', error);
    // }
  }

  private removeRemoteCursor(userId: string): void {
    const cursorData = this.remoteCursors.get(userId);
    if (cursorData && this.editor) {
      this.editor.deltaDecorations([cursorData.decorationId], []);
      this.remoteCursors.delete(userId);
      console.log('🗑️ Removed cursor for user:', userId);
    }
  }

  private applyRemoteContentUpdate(data: ContentUpdate): void {
    if (!this.editor || !this.selectedFile) return;
    console.log('🔄 Applying remote content update:', {
      fromUser: data.userId,
      fileId: data.fileId,
      hasChanges: !!data.changes,
      hasFullContent: !!data.fullContent,
      currentContentLength: this.code.length,
    });

    this.isRemoteUpdate = true;

    // Apply changes or full content
    if (data.fullContent) {
      this.editor.setValue(data.fullContent);
      this.code = data.fullContent;
    } else if (data.changes) {
      // Implement change application logic based on your OT/CRDT strategy
      this.applyChanges(data.changes);
    }

    this.updateUnsavedChanges();
    this.isRemoteUpdate = false;
  }

  private applyChanges(changes: any): void {
    if (!this.editor || !changes) return;

    try {
      // Simple implementation for now
      if (changes.length > 0) {
        const operations = changes.map((change: any) => ({
          range: new monaco.Range(
            change.range.startLineNumber,
            change.range.startColumn,
            change.range.endLineNumber,
            change.range.endColumn
          ),
          text: change.text,
          forceMoveMarkers: true,
        }));

        this.editor.executeEdits('remote', operations);
      }
    } catch (error) {
      console.error('Error applying remote changes:', error);
    }
  }

  getUserColor(userId: string): string {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    const index =
      userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }

  private handleInviteToken(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const projectId = this.route.snapshot.paramMap.get('id');

    if (token && projectId) {
      if (this.currentUserId) {
        // User already logged in - auto accept
        this.acceptProjectInvite(token);
      } else {
        // User not logged in - store for later
        localStorage.setItem('pendingInviteToken', token);
        localStorage.setItem('pendingProjectId', projectId);

        localStorage.setItem('redirectUrl', window.location.href);
      }
    }
  }

  private acceptProjectInvite(token: string): void {
    const projectId = this.route.snapshot.paramMap.get('id');

    if (projectId && token) {
      this.projectService.acceptInvite(projectId, token).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.showNotification('Successfully joined project!', 'success');
            // Remove token from URL
            window.history.replaceState({}, '', window.location.pathname);
          } else {
            this.showNotification(res.message || 'Failed to join project', 'error');
          }
        },
        error: () => {
          this.showNotification('Error joining project', 'error');
        },
      });
    }
  }
}
