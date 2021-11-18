import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { ProductService } from 'src/app/services/data/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  @Input() item: any;
  productForm: FormGroup;
  formName: any;

  constructor(
    public navCtrl: NavController,
    public modalController: ModalController,
    private fb: FormBuilder,
    private _product_service: ProductService
  ) {
    this.initForm();
    this.formName = this.productForm;
  }

  initForm() {
    this.productForm = this.fb.group({
      product_name: ['', Validators.compose([Validators.required])],
      barcode: ['', Validators.compose([Validators.required])],
      sku: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      stock: ['', Validators.compose([Validators.required])],
      isbn: ['', Validators.compose([Validators.required])],
      asin: ['', Validators.compose([Validators.required])],
      ean13: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    if (this.item) {
      this.productForm.setValue({
        product_name: this.item?.product_name || '',
        barcode: this.item?.barcode || '',
        sku: this.item?.sku || '',
        price: this.item?.price || '',
        stock: this.item?.stock || '',
        isbn: this.item?.isbn || '',
        asin: this.item?.asin || '',
        ean13: this.item?.ean13 || '',
      });
    }
  }

  addProduct() {
    this._product_service.loadingPresent();
    this._product_service.addProduct(this.productForm.value, (res) => {
      this._product_service.loadingDismiss();
      if (res.success) {
        this.dismiss();
        this._product_service.presentToast(
          'Product has been added successfully.'
        );
      }
      console.log(res);
    });
  }

  updateProduct() {
    this._product_service.loadingPresent();
    this._product_service.updateProduct(
      { id: this.item.id, payload: this.productForm.value },
      (res) => {
        this._product_service.loadingDismiss();
        if (res.success) {
          this.dismiss();
          this._product_service.presentToast(
            'Product has been updated successfully.'
          );
        }
      }
    );
  }

  // get productObj() {
  //   return  {
  //     product_name: this.productForm.get('product_name').value,
  //     barcode: this.productForm.get('barcode').value,
  //     sku: this.productForm.get('sku').value,
  //     price: this.productForm.get('price').value,
  //     stock: this.productForm.get('stock').value,
  //     ean13: this.productForm.get('ean13').value,
  //     asin: this.productForm.get('asin').value,
  //     isbn: this.productForm.get('isbn').value,
  //   };
  // }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
