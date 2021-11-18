import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AddProductComponent } from 'src/app/component/add-product/add-product.component';
import { ProductService } from 'src/app/services/data/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  productList: any;
  constructor(
    public _product_service: ProductService,
    private modalCtrl: ModalController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.getProduct();
  }

  getProduct() {
    this._product_service.loadingPresent();
    this._product_service.getProducts().subscribe(
      (res: any) => {
        this._product_service.loadingDismiss();
        if (res.success) {
          this.productList = res.data;
        }
      },
      (error) => {
        this._product_service.loadingDismiss();
        console.log(error);
      }
    );
  }

  addProduct() {
    this.productModal();
  }
  updateProduct(data: any) {
    this.productModal(data);
  }
  async productModal(data?: any) {
    const presentModel = await this.modalCtrl.create({
      component: AddProductComponent,
      componentProps: {
        item: data || 0,
      },
      showBackdrop: true,
      mode: 'ios',
      cssClass: 'add-product-modal',
    });

    presentModel.onWillDismiss().then((data) => {
      this.getProduct();
    });

    return await presentModel.present();
  }

  async deleteConfirm(id: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure, you want to delete this product?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log('Confirm Okay');
            this.deleteItem(id);
          },
        },
      ],
    });

    await alert.present();
  }

  deleteItem(id: any) {
    this._product_service.loadingPresent();
    this._product_service.deleteProduct(id, (res) => {
      this._product_service.loadingDismiss();
      if (res.success) {
        this._product_service.presentToast(
          'Product has been deleted successfully.',
          'bottom'
        );
        this.getProduct();
      } else {
        this._product_service.presentToast(
          'ERROR: Unable to delete this product!'
        );
      }
    });
  }
}
