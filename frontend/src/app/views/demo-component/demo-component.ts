import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar-component/navbar-component';
@Component({
  selector: 'app-demo-component',
  imports: [NavbarComponent],
  templateUrl: './demo-component.html',
  styleUrl: './demo-component.css',
})
export class DemoComponent {
  activeFile: string = 'index.js';
  codeLines: string[] = [
    '<span class="text-blue-400">const</span> <span class="text-yellow-300">express</span> = <span class="text-yellow-300">require</span>(<span class="text-green-400">\'express\'</span>);',
    '<span class="text-blue-400">const</span> <span class="text-yellow-300">socketio</span> = <span class="text-yellow-300">require</span>(<span class="text-green-400">\'socket.io\'</span>);',
    '',
    '<span class="text-blue-400">const</span> <span class="text-yellow-300">app</span> = <span class="text-yellow-300">express</span>();',
    '<span class="text-blue-400">const</span> <span class="text-yellow-300">PORT</span> = <span class="text-purple-400">3000</span>;',
    '',
    '<span class="text-gray-500">// Real-time collaboration setup</span>',
    '<span class="text-yellow-300">app</span>.<span class="text-yellow-300">get</span>(<span class="text-green-400">\'/\'</span>, (<span class="text-yellow-300">req</span>, <span class="text-yellow-300">res</span>) => {</span>',
    '  <span class="text-yellow-300">res</span>.<span class="text-yellow-300">send</span>(<span class="text-green-400">\'Welcome to CodeCollab!\'</span>);',
    '});',
    '',
    '<span class="text-yellow-300">app</span>.<span class="text-yellow-300">listen</span>(<span class="text-yellow-300">PORT</span>, () => {',
    '  <span class="text-yellow-300">console</span>.<span class="text-yellow-300">log</span>(<span class="text-green-400">`Server running on port ${PORT} ✅`</span>);',
    '});'
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
