import { Component, OnInit } from '@angular/core';
import { empresaService } from 'src/app/services/empresa.service';
import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-top10-vendidos',
  templateUrl: './top10-vendidos.component.html',
  styleUrls: ['./top10-vendidos.component.css']
})
export class Top10VendidosComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(private empresaServicio: empresaService) { }

  ngOnInit(): void {
    this.ventasXcat()
  }
  productosChart: string[] = []
  contProductos: number[] = []
  paraSort: any[] = []
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
          let agregar = {
            nombre: producto,
            cantidad: contProductos
          }
          this.paraSort.push(agregar)
          this.paraSort.sort((a,b)=>b.cantidad-a.cantidad)
        });

        this.paraSort.splice(10)
        console.log(this.paraSort)
        this.paraSort.forEach(element => {
          this.productosChart.push(element.nombre)
          this.contProductos.push(element.cantidad)
        });
        this.createChart()
      })
    })
    
  }

  myChart: any
  createChart() {
    let chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.productosChart,
        datasets: [
          {
            label: "Mas vendidos",
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
