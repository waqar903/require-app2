import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LoadingController, ToastController } from '@ionic/angular';

export interface IProduct {
  userId: string;
  id: string;
  title: string;
  body: string;
}
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  isLoading: boolean;
  constructor(
    private http: HttpClient,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) {}

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
  async loadingPresent() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 7000,
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
  }
  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => console.log('dismissed'));
  }

  /*********************************
   *
   *  get
   *
   *********************************/
  getProducts(): Observable<any> {
    return this.http
      .get(environment.API_URL + '/products', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ZTz6IychGvY2x9hTETYfO4jw5jypMaX9twbpQBeO',
        }),
      })
      .pipe(map(this.extractData), retry(1), catchError(this.handleError));
  }

  /*********************************
   *
   *  Add
   *
   *********************************/

  addProduct(obj: any, callback: (data: any) => any) {
    return this.http
      .post(environment.API_URL + '/products', obj, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ZTz6IychGvY2x9hTETYfO4jw5jypMaX9twbpQBeO',
        }),
      })
      .subscribe(
        (res) => {
          callback(res);
        },
        (err) => {
          callback(err);
        }
      );
  }

  /*********************************
   *
   *  Update
   *
   *********************************/

  updateProduct(obj: any, callback: (data: any) => any) {
    return this.http
      .put(environment.API_URL + `/products/${obj.id}`, obj.payload, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ZTz6IychGvY2x9hTETYfO4jw5jypMaX9twbpQBeO',
        }),
      })
      .subscribe(
        (res) => {
          callback(res);
        },
        (err) => {
          callback(err);
        }
      );
  }

  /*********************************
   *
   *  Delete
   *
   *********************************/

  deleteProduct(id: number, callback: (data: any) => any) {
    return this.http
      .delete(environment.API_URL + '/products/' + id, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ZTz6IychGvY2x9hTETYfO4jw5jypMaX9twbpQBeO',
        }),
      })
      .subscribe(
        (res) => {
          callback(res);
        },
        (err) => {
          callback(err);
        }
      );
  }

  identify(index, item) {
    return item.name || index;
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  async presentToast(messages: any, p?: any) {
    const toast = await this.toastController.create({
      message: messages,
      position: p || 'bottom',
      duration: 3000,
      cssClass: 'toastCustom',
      // showCloseButton: true,
      // closeButtonText: 'OK'
    });
    toast.present();
  }
}
