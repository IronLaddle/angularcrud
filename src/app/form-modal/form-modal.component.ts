import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html'
})
export class FormModalComponent { 
   @Input() id: number = 0;
   @Input() delete: boolean = false;

   myForm: FormGroup = new FormGroup({}); 
  
  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: FormBuilder,
   public authService: AuthService
  )
   {
    this.createForm();
  } 
  
  public createForm() {
    this.myForm = this.formBuilder.group({
      id: '',
      product: '',
      address: ''
    });
  } 
  
  public submitForm(form:NgForm) {
    console.log(form.value);
    this.activeModal.close(form.value);
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

  isZero(){
    return this.id == 0 ? true : false
  }

  remove(){
    this.delete = true;
  }
}