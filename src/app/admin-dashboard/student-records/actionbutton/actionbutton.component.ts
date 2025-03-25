import { ICellRendererAngularComp } from 'ag-grid-angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { StudentRecordsComponent } from '../student-records.component';
import { NewStudentComponent } from '../new-student/new-student.component';
import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-actionbutton',
  imports: [FaIconComponent],
  templateUrl: './actionbutton.component.html',
  styleUrl: './actionbutton.component.css'
})
export class ActionbuttonComponent implements ICellRendererAngularComp {
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  params: any;
  showModal = false;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }

  onEdit(): void {
    this.params.onEdit(this.params.data.studentId |  this.params.data.teacherId );
  }

  onDelete(): void {
    this.params.onDelete(this.params.data.studentId |  this.params.data.teacherId );
  }

  
}