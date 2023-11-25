import { Component, OnInit } from '@angular/core';
import { empresaService } from 'src/app/services/empresa.service';
import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-ventas-xcat',
  templateUrl: './ventas-xcat.component.html',
  styleUrls: ['./ventas-xcat.component.css']
})
export class VentasXcatComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(private empresaServicio: empresaService) { }

  ngOnInit(): void {
    this.ventasXcat()
  }

  categoriasChart: string[] = []
  contVentas: number[] = []
  ventasXcat() {
    this.categoriasChart = []
    this.contVentas = []
    this.empresaServicio.prodVendidosXcat(window.localStorage.getItem('empresa')!).subscribe((res) => {
      let historial = res

      this.empresaServicio.getProductos(window.localStorage.getItem('empresa')!).subscribe((res) => {
        let productos = res
        let categoria: string
        let contVentas: number
        productos.forEach((producto: any) => {
          categoria = producto.categoria
          contVentas = 0
          historial.forEach((historial: any) => {
            if (historial.idProducto == producto._id) {
              contVentas += 1
            }
          });
          this.categoriasChart.push(categoria)
          this.contVentas.push(contVentas)
        });
        this.createChart()
      })
    })
    console.log(this.categoriasChart)
    console.log(this.contVentas)
  }

  myChart: any
  createChart() {
    let chart = new Chart("MyChart", {
      type: 'polarArea', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.categoriasChart,
        datasets: [
          {
            label: "Ganancias",
            data: this.contVentas,
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
