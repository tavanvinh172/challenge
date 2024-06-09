import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { MapChart, Chart } from 'angular-highcharts';
@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css']
})
export class DashboardsComponent implements OnInit {
  monthForm: FormGroup;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  selectedMonths: string[] = [];
  date = new Date();
  contextIncomeMenuVisible = false;
  contextOperationalExpensesMenuVisible = false;
  contextExpensesMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  currentInputValue: string = "";
  @ViewChildren('categoryInput') categoryInputs?: QueryList<ElementRef>;
  @ViewChildren('categoryInputOperationalExpense') categoryInputOperationalExpense?: QueryList<ElementRef>;
  @ViewChildren('categoryInputExpense') categoryInputExpense?: QueryList<ElementRef>;


  constructor(private fb: FormBuilder,  private cdref: ChangeDetectorRef ) {
    this.monthForm = this.fb.group({
      startMonth: '',
      endMonth: '',
      incomeCategory: this.fb.array([]),
      operationalExpensesCategory: this.fb.array([]),
      expenseCategory: this.fb.array([])
    });
  }
  
  incomeTotal = {} as any;
  operationalExpenseTotal = {} as any;
  expenseTotal = {} as any;
  openingBalance = [
  ] as OpeningBalance[];
  
  showContextMenuIncome(event: MouseEvent, formControl: any) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextIncomeMenuVisible = true;
    this.currentInputValue = formControl.value;
  }

  showContextOperationalExpense(event: MouseEvent, formControl: any) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextOperationalExpensesMenuVisible = true;
    this.currentInputValue = formControl.value;
  }

  showContextExpense(event: MouseEvent, formControl: any) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextExpensesMenuVisible = true;
    this.currentInputValue = formControl.value;
  }

  applyToAllOperationalExpense(i: number) {
    this.selectedMonths.forEach(month => {
    this.operationalExpensesCategory.controls.at(i)?.get(month.toLowerCase())?.setValue(this.currentInputValue);
    })
    this.contextOperationalExpensesMenuVisible = false;
    this.currentInputValue = "";
  }

  applyToAllIncome(i: number) {
    this.selectedMonths.forEach(month => {
    this.incomeCategory.controls.at(i)?.get(month.toLowerCase())?.setValue(this.currentInputValue);
    })
    this.contextIncomeMenuVisible = false;
    this.currentInputValue = "";
  }

  applyToAllExpense(i: number) {
    this.selectedMonths.forEach(month => {
    this.expenseCategory.controls.at(i)?.get(month.toLowerCase())?.setValue(this.currentInputValue);
    })
    this.contextExpensesMenuVisible = false;
    this.currentInputValue = "";
  }

  get incomeCategory(): FormArray {
    return this.monthForm.get('incomeCategory') as FormArray;
  }

  get operationalExpensesCategory(): FormArray {
    return this.monthForm.get('operationalExpensesCategory') as FormArray;
  }

  get expenseCategory(): FormArray {
    return this.monthForm.get('expenseCategory') as FormArray;
  }

  incomeCategoryControlAtIndex(index: number): FormControl {
    return this.incomeCategory.at(index) as FormControl;
  }

  operationalExpensesCategoryControlAtIndex(index: number): FormControl {
    return this.operationalExpensesCategory.at(index) as FormControl;
  }

  expensesCategoryControlAtIndex(index: number): FormControl {
    return this.expenseCategory.at(index) as FormControl;
  }

  createMonthControls(): { [key: string]: FormControl } {
    const controls: { [key: string]: FormControl } = {};
    this.selectedMonths.forEach(month => {
      controls[month.toLowerCase()] = new FormControl('');
    });
    return controls;
  }

  updateOperationalExpensesCategoryFormArray(): void {
    const formGroup = this.fb.group({
      category: new FormControl(''),
      ...this.createMonthControls()
    });
    this.operationalExpensesCategory.push(formGroup);
  // });
  }

  updateIncomeCategoryFormArray(): void {
      const formGroup = this.fb.group({
        category: new FormControl(''),
        ...this.createMonthControls()
      });
      this.incomeCategory.push(formGroup);
    // });
  }

  updateExpenseFormArray(): void {
    const formGroup = this.fb.group({
      category: new FormControl(''),
      ...this.createMonthControls()
    });
    this.expenseCategory.push(formGroup);
  // });
  }

  clearIncomeCategoryFormArray(): void {
    while (this.incomeCategory.length) {
      this.incomeCategory.removeAt(0);
    }
  }

  clearOperationalExpensesCategoryFormArray(): void {
    while (this.operationalExpensesCategory.length) {
      this.operationalExpensesCategory.removeAt(0);
    }
  }

  clearExpensesCategoryFormArray(): void {
    while (this.operationalExpensesCategory.length) {
      this.operationalExpensesCategory.removeAt(0);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    const startMonth = this.monthForm.value.startMonth;
    const endMonth = this.monthForm.value.endMonth;

    const startIndex = this.months.indexOf(startMonth);
    const endIndex = this.months.indexOf(endMonth);

    if (startIndex >= 0 && endIndex >= 0 && startIndex <= endIndex) {
      this.selectedMonths = this.months.slice(startIndex, endIndex + 1);
      this.incomeTotal = {} as any;
      this.operationalExpenseTotal = {} as any;
      this.expenseTotal = {} as any;
      this.openingBalance = [
      ] as OpeningBalance[];
      this.clearIncomeCategoryFormArray();
      this.clearOperationalExpensesCategoryFormArray();
      this.clearExpensesCategoryFormArray();
      this.updateIncomeCategoryFormArray();
      this.updateOperationalExpensesCategoryFormArray();
      this.updateExpenseFormArray();
      this.selectedMonths.forEach(element => {
        this.openingBalance.push(new OpeningBalance(element.toLowerCase(), 0))
      });
    } else {
      this.selectedMonths = [];
    }
  }

  getTotalIncome(month: string) : number{
    let total = 0;
    this.incomeCategory.controls.forEach(element => {
      total = total + element.get(month.toLowerCase())?.value;
    });
    this.incomeTotal[month.toLowerCase()]= total; 
    return total;
  }
  
  getSubtotalExpense(month: string) : number{
    let total = 0;
    this.operationalExpensesCategory.controls.forEach(element => {
      total = (total + element.get(month.toLowerCase())?.value);
    })
    this.operationalExpenseTotal[month.toLowerCase()]= Math.floor((total + (total / 6))); 
    return Math.floor((total + (total / 6)));
  }

  getExpenseTotal(month: string) : number{
    let total = 0;
    this.expenseCategory.controls.forEach(element => {
      total = total + element.get(month.toLowerCase())?.value;
    })
    this.expenseTotal[month.toLowerCase()]= total;
    return total;
  }

  getProfitLoss(month: string): number{
    return this.incomeTotal[month.toLowerCase()] - this.getFinalTotalExpense(month);
  }

  getClosingBalance(month: string): number{
    let total = 0;
    this.getOpeningBalance().forEach(element => {
      total = element.value + this.getProfitLoss(month);
    });
    return total;
  }

  getOpeningBalance() : OpeningBalance[] {
    for (let index = 1; index < this.openingBalance.length; index++) {
      let element = this.openingBalance[index];
      element.value = this.getProfitLoss(this.openingBalance[index - 1].month);
    }
    return this.openingBalance;
  }
  // getOpeningBalance() : number{}

  getFinalTotalExpense(month: string) : number {
    return this.operationalExpenseTotal[month] + this.expenseTotal[month];
  }

  getFormControl(control: AbstractControl | null): FormControl {
    if(control != null){
      return control as FormControl;
    }
    return new FormControl('');
  }

  handleTab(event: KeyboardEvent, groupIndex: number, controlName: string) {
    if (event.key === 'Tab' && controlName === this.selectedMonths[this.selectedMonths.length - 1].toLowerCase()) {
      if (groupIndex === this.incomeCategory.length - 1) {
        event.preventDefault();
        this.updateIncomeCategoryFormArray();
        setTimeout(() => {
          this.categoryInputs!.last.nativeElement.focus();
        });
      }
    }
  }

  handleTabOperationalExpense(event: KeyboardEvent, groupIndex: number, controlName: string) {
    if (event.key === 'Tab' && controlName === this.selectedMonths[this.selectedMonths.length - 1].toLowerCase()) {
      if (groupIndex === this.operationalExpensesCategory.length - 1) {
        event.preventDefault();
        this.updateOperationalExpensesCategoryFormArray();
        setTimeout(() => {
          this.categoryInputOperationalExpense!.last.nativeElement.focus();
        });
      }
    }
  }

  handleTabExpense(event: KeyboardEvent, groupIndex: number, controlName: string) {
    if (event.key === 'Tab' && controlName === this.selectedMonths[this.selectedMonths.length - 1].toLowerCase()) {
      if (groupIndex === this.expenseCategory.length - 1) {
        event.preventDefault();
        this.updateExpenseFormArray();
        setTimeout(() => {
          this.categoryInputExpense!.last.nativeElement.focus();
        });
      }
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
 }
}

class OpeningBalance{
  constructor(public month: string, public value: any){}
}