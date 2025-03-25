import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment.development';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';



export  interface Teacher {
  teacherId: number;
  firstName: string;
  lastName: string;
    email: string;
  phoneNumber: string|null;
}
export  interface Student {
  
    studentId: number;
    FirstName: string;
    lastName: string;
    email: string;
    phoneNumber: string|null;
    className :string;
    sectionName:string;
  
}

export  interface Class {
  
  classId: number;
  className: string;
  sectionName:string;
  subjects:string;
  teacherId:number
  

}

@Injectable({
  providedIn: 'root'
})



export class AdminService {

  private url=environment.apiUrl
  constructor(private http:HttpClient) { }

  //STUDENTS CRUD API"S

  getStudents():Observable<Student[]>{
    return this.http.get<Student[]>(`${this.url}/admin/students`)
    .pipe(
      catchError(error=>{
        throw 'error fetching student records' +error;

      })
    );
  }

  addStudent(student:Omit<Student,'studentId'>):Observable<Student>{
    return this.http.post<Student>(`${this.url}/admin/students`,student);
  }

  deleteStudent(id:number):Observable<void>{
    return  this.http.delete<void>(`${this.url}/admin/students/${id}`)
  }

  
  updateStudent(student: Student, studentData: any): Observable<Student> {
  return this.http.put<Student>(`${this.url}/admin/students/${student}`, studentData);
  }

  //TEACHERS CRUD API"S

  getTeachers():Observable<Teacher[]>{
    return this.http.get<Teacher[]>(`${this.url}/admin/teachers`)
    .pipe(
      catchError(error=>{
        throw 'error fetching teachers records' +error;

      })
    );
  }
  addTeachers(teacher:Omit<Teacher,'teacherId'>):Observable<Teacher>{
    return this.http.post<Teacher>(`${this.url}/admin/teachers`,teacher);
  }


  updateTeacher(teacherId: Teacher, teacherData: any): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.url}/admin/teachers/${teacherId}`, teacherData);
    }
  
  deleteTeacher(teacherId:number):Observable<void>{
    return  this.http.delete<void>(`${this.url}/admin/teachers/${teacherId}`)
  }


  getClasses():Observable<Class[]>{
    return this.http.get<Class[]>(`${this.url}/admin/classes`)
    .pipe(
      catchError(error=>{
        throw 'error fetching teachers records' +error;

      })
    );
  }

  }


