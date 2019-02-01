import { BadInput } from './../common/bad-input';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { promise } from 'protractor';


@Injectable()
export class DataService {
//private apiUrl='http://103.249.98.101:3002/'; // Dev URL
private apiUrl='http://103.249.98.246:3002/'; // Prod URL
//private apiUrl='http://192.168.1.156:3002/'; //local
//private apiUrl='http://192.168.1.156:3003/'; //local soa

  constructor(private http: HttpClient) { }

  getAll(url,body,headerData={},methode="POST") {
    const getUrl=this.apiUrl+url;
     const  getMehode=methode;
     console.log(getMehode);
     if(methode == "POST"){
     return this.http.post(getUrl,body,{headers:headerData})
      .map(response => response)
      .catch(this.handleError);
    }else{
      return this.http.get(getUrl,{headers:headerData})
      .map(response => response)
      .catch(this.handleError);
    }
  }  
  
   create(url,resource,headerData={}) {
    const createUrl=this.apiUrl+url;
    return this.http.post(createUrl,resource,{headers:headerData})//JSON.stringify(resource)
      .map(response => response)
      .catch(this.handleError);
  }

   update(url,resource) {
    const updateUrl=this.apiUrl+url;
    return this.http.patch(updateUrl + '/' + resource.id, JSON.stringify({ isRead: true }))
      .map(response => response)      
      .catch(this.handleError);
  }

    delete(url,id) {
    const deleteUrl=this.apiUrl+url
      return this.http.delete(deleteUrl + '/' + id)
      .map(response => response)
      .catch(this.handleError);
  }

  private handleError(error: Response) {

    if (error.status === 400)
      return Observable.throw(new BadInput(error));
  
    if (error.status === 404)
      return Observable.throw(new NotFoundError());
    
    return Observable.throw(new AppError(error));
  }
}
