import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  uploadFiles(file: FormData) {
    return this.http.post('http://localhost:8080/api/files/upload', file);
  }

  parseFiles(files: any) {
    return this.http.post('http://localhost:8080/api/files/parse', { files: files });
  }

}
