import { Component, OnInit } from '@angular/core';
import { empresaService } from 'src/app/services/empresa.service';
import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import Chart from 'chart.js/auto';




@Component({
  selector: 'app-ganancias-xcat',
  templateUrl: './ganancias-xcat.component.html',
  styleUrls: ['./ganancias-xcat.component.css']
})
export class GananciasXcatComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(
    private empresaServicio: empresaService,

  ) { }

  ngOnInit(): void {
    this.gananciasXcat()
  }

  categoriasChart: string[] = []
  gananciasChar: number[] = []

  gananciasXcat() {
    this.categoriasChart = []
    this.gananciasChar = []
    this.empresaServicio.gananciasXcat(window.localStorage.getItem('empresa')!).subscribe((res) => {
      let historial = res

      this.empresaServicio.getProductos(window.localStorage.getItem('empresa')!).subscribe((res) => {
        let productos = res
        let categoria: string
        let acumGanancias: number
        productos.forEach((producto: any) => {
          categoria = producto.categoria
          acumGanancias = 0
          historial.forEach((historial: any) => {
            if (historial.idProducto == producto._id) {

              acumGanancias += historial.precio
            }
          });
          this.categoriasChart.push(categoria)
          this.gananciasChar.push(acumGanancias)
        });
        console.log(this.categoriasChart)
        console.log(this.gananciasChar)
        this.createChart()
      })
    })



  }

  myChart: any
  createChart() {
    let chart = new Chart("MyChart", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.categoriasChart,
        datasets: [
          {
            label: "Ganancias",
            data: this.gananciasChar,
            backgroundColor: ['yellow','blue','red','green']
          },
        ]
      },
      options: {
        aspectRatio: 1
      }

    })
    this.myChart = chart;
  }


}


