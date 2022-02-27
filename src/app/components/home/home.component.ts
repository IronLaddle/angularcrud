import { Product } from './../../shared/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../shared/auth.service';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormModalComponent } from '../../form-modal/form-modal.component';

import { Guid } from "guid-typescript";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: Object = {};
  faEdit = faEdit;
  public currentUrl: string = "";

  constructor(
    public authService: AuthService,
    private actRoute: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
  ) {
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.authService.getProducts().subscribe(res => {
      this.currentUser = res.msg;
    })
   }

  ngOnInit(): void {
    this.currentUrl = location.origin;
  }

  openFormModal() {
    console.log('called');
    this.authService.getDetail().subscribe((res) => {
    });


    const modalRef = this.modalService.open(FormModalComponent);
    modalRef.result.then((result) => {
      result as Product
      result.id = Guid.create().toString();
      this.authService.list.push(result)
    }).catch((error) => {
      console.log(error);
    });
  }

  populateForm(selectedRecord:any){
    const modalRef = this.modalService.open(FormModalComponent);
    this.authService.formData = Object.assign({}, selectedRecord);
    modalRef.componentInstance.id = selectedRecord.id; 

    modalRef.result.then((result) => {
      result as Product
    
    result.id = modalRef.componentInstance.id;
    var objIndex: number = this.authService.list.findIndex((obj => obj.id == result.id));

    if(modalRef.componentInstance.delete)
      this.authService.list.splice(objIndex);
    else
    {
      this.authService.list[objIndex].productName = result.productName;
      this.authService.list[objIndex].url = result.url;
    }
    
    }).catch((error) => {
      console.log(error);
    });

  }

}
