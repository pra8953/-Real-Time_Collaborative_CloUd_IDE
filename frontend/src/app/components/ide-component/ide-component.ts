import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const monaco: any;

interface File {
  id: string;
  name: string;
  content: string;
  language: string;
  unsavedChanges?: boolean;
}

@Component({
  selector: 'app-ide-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ide-component.html',
  styleUrls: ['./ide-component.css']
})
export class IdeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;
  @ViewChild('fileNameInput', { static: false }) fileNameInput!: ElementRef;

  private editor: any;
  private monacoLoaded = false;
  private previewWindow: Window | null = null;

  // Editor state
  code: string = '';
  files: File[] = [];
  selectedFile: File | null = null;
  private originalContent: string = '';

  // File operations
  isCreatingFile: boolean = false;
  newFileName: string = 'new-file.html';

  // Sample initial files
  private initialFiles: File[] = [
    {
      id: '1',
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
      language: 'html'
    },
    {
      id: '2',
      name: 'styles.css',
      content: `/* Main Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 3rem;
    border-radius: 15px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    text-align: center;
    max-width: 500px;
    width: 90%;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 2.5rem;
    font-weight: 300;
}

p {
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
}

button {
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,123,255,0.3);
}`,
      language: 'css'
    },
    {
      id: '3',
      name: 'script.js',
      content: `// JavaScript File
console.log('🚀 Script loaded successfully!');

function showAlert() {
    alert('Hello from JavaScript! 🎉');
    console.log('Button clicked!');
}

// Sample function
function calculateSum(a, b) {
    return a + b;
}

// Event listener for page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Add some dynamic content
    const container = document.querySelector('.container');
    if (container) {
        const dynamicElement = document.createElement('p');
        dynamicElement.textContent = 'This text was added dynamically by JavaScript!';
        dynamicElement.style.color = '#28a745';
        dynamicElement.style.marginTop = '1rem';
        container.appendChild(dynamicElement);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateSum, showAlert };
}`,
      language: 'javascript'
    }
  ];

  ngOnInit() {
    this.loadFiles();
    this.loadMonacoEditor();
  }

  ngAfterViewInit() {
    // Editor will be initialized when monaco is loaded
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.dispose();
    }
    if (this.previewWindow && !this.previewWindow.closed) {
      this.previewWindow.close();
    }
  }

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
    this.previewWindow = window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
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
    if (this.monacoLoaded) return;

    try {
      await this.loadMonacoScript();
      this.monacoLoaded = true;
      console.log('✅ Monaco Editor loaded successfully');
      
      if (this.selectedFile) {
        setTimeout(() => this.initializeEditor(), 100);
      }
    } catch (error) {
      console.error('❌ Failed to load Monaco Editor:', error);
      this.showNotification('Failed to load code editor. Using basic text area.', 'error');
    }
  }

  private loadMonacoScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof monaco !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
      script.onload = () => {
        (window as any).require.config({ 
          paths: { 
            vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' 
          } 
        });
        
        (window as any).require(['vs/editor/editor.main'], () => {
          resolve();
        }, (error: any) => {
          reject(error);
        });
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
          useShadows: false
        }
      });

      // Listen to content changes
      this.editor.onDidChangeModelContent(() => {
        const newCode = this.editor.getValue();
        if (this.code !== newCode) {
          this.code = newCode;
          this.updateUnsavedChanges();
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

  // ✅ FILE OPERATIONS
  loadFiles() {
    // Simulate API call
    setTimeout(() => {
      this.files = [...this.initialFiles];
      console.log('📂 Files loaded:', this.files.length);
    }, 500);
  }

  selectFile(file: File) {
    // Check for unsaved changes
    if (this.hasUnsavedChanges() && this.selectedFile) {
      const confirmChange = confirm(`You have unsaved changes in ${this.selectedFile.name}. Do you want to continue without saving?`);
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

    const newFile: File = {
      id: Date.now().toString(),
      name: this.newFileName,
      content: this.getDefaultContent(this.newFileName),
      language: this.getLanguageFromExtension(this.newFileName)
    };

    this.files.push(newFile);
    this.isCreatingFile = false;
    this.newFileName = '';
    this.selectFile(newFile);
    this.showNotification('File created successfully!', 'success');
  }

  cancelCreateFile() {
    this.isCreatingFile = false;
    this.newFileName = '';
  }

  deleteFile(fileId: string, event: Event) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      this.files = this.files.filter(file => file.id !== fileId);
      
      if (this.selectedFile && this.selectedFile.id === fileId) {
        this.selectedFile = null;
        this.code = '';
        this.originalContent = '';
      }
      
      this.showNotification('File deleted successfully!', 'success');
    }
  }

  // ✅ EDITOR ACTIONS
  hasUnsavedChanges(): boolean {
    return this.selectedFile ? this.code !== this.originalContent : false;
  }

  updateUnsavedChanges() {
    if (this.selectedFile) {
      this.selectedFile.unsavedChanges = this.hasUnsavedChanges();
    }
  }

  saveFile() {
    if (this.selectedFile) {
      // Simulate API call
      setTimeout(() => {
        this.selectedFile!.content = this.code;
        this.originalContent = this.code;
        this.updateUnsavedChanges();
        this.showNotification('File saved successfully!', 'success');
      }, 300);
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
      'html': 'html', 'htm': 'html',
      'css': 'css',
      'js': 'javascript', 'jsx': 'javascript',
      'ts': 'typescript', 'tsx': 'typescript',
      'json': 'json',
      'md': 'markdown',
      'txt': 'plaintext'
    };
    
    return languageMap[ext || ''] || 'plaintext';
  }

  getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const icons: { [key: string]: string } = {
      'html': '🌐', 'htm': '🌐', 'css': '🎨', 
      'js': '📜', 'jsx': '⚛️', 'ts': '🔷', 'tsx': '⚛️',
      'json': '📋', 'md': '📝', 'txt': '📄'
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
}