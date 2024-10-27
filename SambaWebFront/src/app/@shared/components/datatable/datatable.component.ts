import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss',
})
export class DatatableComponent implements OnInit {
  @Input() columnNames!: string[];
  @Input() data!: any[];

  columns!: any[];
  tableLayout!: any[];

  ngOnInit(): void {
    this.columns = this.columnNames.map((columnName) => ({
      name: columnName,
      width: 100 / this.columnNames.length,
    }));
    this.tableLayout = this.generateTableLayout();
  }

  generateTableLayout(): any[] {
    const tableLayout = [];
    for (let i = 0; i < this.data.length; i++) {
      const row = [];
      for (let j = 0; j < this.columns.length; j++) {
        row.push({
          value: this.data[i][this.columns[j].name],
          width: this.columns[j].width,
        });
      }
      tableLayout.push(row);
    }
    return tableLayout;
  }
}
