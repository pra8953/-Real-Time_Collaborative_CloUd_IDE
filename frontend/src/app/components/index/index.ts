import { Component } from '@angular/core';
import { MeslistComponent } from "../meslist-component/meslist-component";
import { ProjectlistComponent } from "../projectlist-component/projectlist-component";

@Component({
  selector: 'app-index',
  imports: [ ProjectlistComponent],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {

}
