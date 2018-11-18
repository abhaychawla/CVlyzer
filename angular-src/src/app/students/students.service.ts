import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient) { }

  getApplicants(): Observable<any> {
    return this.http.get('http://localhost:8080/api/search/all').pipe(
      map((response: any) => {
        let resumeData = [];
        for (const file of response.response) {
          file._source.data.data.id = file._id;
          file._source.data.data.filename = file._source.name;
          file._source.data.data.downloadUrl = file._source.filePath;
          resumeData.push(file._source.data.data);
        }
        return resumeData;
      })
    );
  }

  getApplicantDetails(id: string): Observable<any> {
    return this.http.get(`http://localhost:8080/api/search/${id}`).pipe(
      map((response: any) => {
        return response.response.data.data;
      })
    );
  }

  deleteApplicant(filename: string, id: string): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/files/${filename}`).pipe(
      mergeMap(() => {
        return this.http.delete(`http://localhost:8080/api/search/${id}`).pipe(map((res: any) => {
          return res.response;
        }));
      }
    ));
  }

  masterSearch(query: any) {
    return this.http.post('http://localhost:8080/api/search/master', { query: query }).pipe(
      map((response: any) => {
        let resumeData = [];
        for (const file of response.response) {
          file._source.data.data.id = file._id;
          file._source.data.data.downloadUrl = file._source.filePath;
          resumeData.push(file._source.data.data);
        }
        return resumeData;
      })
    );
  }

  subSectionSearch(query: any) {
    return this.http.post('http://localhost:8080/api/search/phrase', { query: query }).pipe(
      map((response: any) => {
        let resumeData = [];
        for (const file of response.response) {
          file._source.data.data.id = file._id;
          file._source.data.data.downloadUrl = file._source.filePath;
          resumeData.push(file._source.data.data);
        }
        return resumeData;
      })
    );
  }

}
