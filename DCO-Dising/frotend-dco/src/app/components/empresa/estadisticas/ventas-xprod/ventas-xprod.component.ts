import { Component, OnInit } from '@angular/core';
import { empresaService } from 'src/app/services/empresa.service';
import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-ventas-xprod',
  templateUrl: './ventas-xprod.component.html',
  styleUrls: ['./ventas-xprod.component.css']
})
export class VentasXprodComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(private empresaServicio: empresaService) { }

  ngOnInit(): void {
    this.ventasXcat()
  }
  productosChart: string[] = []
  contProductos: number[] = []
  ventasXcat() {
    this.productosChart = []
    this.contProductos = []
    this.empresaServicio.prodVendidosXcat(window.localStorage.getItem('empresa')!).subscribe((res) => {
      let historial = res

      this.empresaServicio.getProductos(window.localStorage.getItem('empresa')!).subscribe((res) => {
        let productos = res
        let producto: string
        let contProductos: number
        productos.forEach((prodActual: any) => {
          producto = prodActual.nombre
          contProductos = 0
          historial.forEach((historial: any) => {
            if (historial.idProducto == prodActual._id) {
              contProductos += 1
            }
          });
          this.productosChart.push(producto)
          this.contProductos.push(contProductos)
        });
        this.createChart()
      })
    })
    console.log(this.productosChart)
    console.log(this.contProductos)
  }

  myChart: any
  createChart() {
    let chart = new Chart("MyChart", {
      type: 'doughnut', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.productosChart,
        datasets: [
          {
            label: "Ganancias",
            data: this.contProductos,
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
