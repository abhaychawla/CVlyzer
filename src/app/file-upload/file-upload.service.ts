import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  // getFiles() {
  //   return this.http.get('http://localhost:8080/files');
  // }

  uploadFiles(file: FormData) {
    return this.http.post('http://localhost:8080/files/upload', file);
  }

  parseFiles(files: any) {
    return this.http.post('http://localhost:8080/files/parse', { files: files });
  }

}
