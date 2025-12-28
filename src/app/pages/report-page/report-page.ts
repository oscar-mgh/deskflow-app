import { Component, ElementRef, OnInit, OnDestroy, signal, effect, viewChild } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'report-page',
  standalone: true,
  templateUrl: './report-page.html',
})
export class ReportPage implements OnInit, OnDestroy {
  private trendChartDom = viewChild<ElementRef>('trendChart');
  private priorityChartDom = viewChild<ElementRef>('priorityChart');
  private slaChartDom = viewChild<ElementRef>('slaChart');
  private agentsChartDom = viewChild<ElementRef>('agentsChart');
  private efficiencyChartDom = viewChild<ElementRef>('efficiencyChart');

  private charts: echarts.ECharts[] = [];

  public totalTickets = signal(1250);
  public slaCompliance = signal(98.4);
  public avgResolutionTime = signal('14m 20s');

  constructor() {
    effect(() => {
      const resizeObserver = new ResizeObserver(() => {
        this.charts.forEach((chart) => chart.resize());
      });
      resizeObserver.observe(document.body);
    });
  }

  ngOnInit() {
    setTimeout(() => this.initCharts(), 0);
  }

  private initCharts() {
    const commonStyle = {
      primary: '#a3e635',
      secondary: '#3f3f46',
      text: '#94a3b8',
      grid: '#27272a',
    };

    const trend = echarts.init(this.trendChartDom()?.nativeElement, 'dark');
    trend.setOption(this.getTrendOption(commonStyle));
    this.charts.push(trend);

    const priority = echarts.init(this.priorityChartDom()?.nativeElement, 'dark');
    priority.setOption(this.getPriorityOption(commonStyle));
    this.charts.push(priority);

    const sla = echarts.init(this.slaChartDom()?.nativeElement, 'dark');
    sla.setOption(this.getSlaOption(commonStyle));
    this.charts.push(sla);

    const agents = echarts.init(this.agentsChartDom()?.nativeElement, 'dark');
    agents.setOption(this.getAgentsOption(commonStyle));
    this.charts.push(agents);

    const efficiency = echarts.init(this.efficiencyChartDom()?.nativeElement, 'dark');
    efficiency.setOption(this.getEfficiencyOption(commonStyle));
    this.charts.push(efficiency);
  }

  private getTrendOption(s: any) {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
        axisLine: { show: false },
      },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: s.grid } } },
      series: [
        {
          name: 'Tickets',
          type: 'line',
          smooth: true,
          data: [150, 230, 224, 218, 135, 147, 260],
          itemStyle: { color: s.primary },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(163, 230, 53, 0.3)' },
              { offset: 1, color: 'transparent' },
            ]),
          },
        },
      ],
    };
  }

  private getPriorityOption(s: any) {
    return {
      backgroundColor: 'transparent',
      series: [
        {
          type: 'pie',
          radius: ['60%', '85%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10 },
          label: { show: false },
          data: [
            { value: 1048, name: 'Baja', itemStyle: { color: s.primary } },
            { value: 735, name: 'Media', itemStyle: { color: '#84cc16' } },
            { value: 580, name: 'Alta', itemStyle: { color: '#facc15' } },
            { value: 484, name: 'Crítica', itemStyle: { color: '#ef4444' } },
          ],
        },
      ],
    };
  }

  private getSlaOption(s: any) {
    return {
      backgroundColor: 'transparent',
      xAxis: { type: 'value', splitLine: { show: false } },
      yAxis: { type: 'category', data: ['IT', 'RRHH', 'Ventas', 'Legal'] },
      series: [
        {
          type: 'bar',
          data: [98, 92, 85, 99],
          itemStyle: { color: s.primary, borderRadius: [0, 5, 5, 0] },
        },
      ],
    };
  }

  private getAgentsOption(s: any) {
    return {
      backgroundColor: 'transparent',
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['Ana', 'Luis', 'Marta', 'Juan'] },
      yAxis: { type: 'value' },
      series: [
        { type: 'bar', barWidth: '40%', data: [45, 38, 52, 30], itemStyle: { color: '#3f3f46' } },
      ],
    };
  }

  private getEfficiencyOption(s: any) {
    return {
      backgroundColor: 'transparent',
      radar: {
        indicator: [
          { name: 'Velocidad', max: 100 },
          { name: 'SLA', max: 100 },
          { name: 'Calidad', max: 100 },
          { name: 'Carga', max: 100 },
          { name: 'Feedback', max: 100 },
        ],
        splitArea: { show: false },
        axisLine: { lineStyle: { color: s.grid } },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [80, 98, 90, 70, 95],
              name: 'Actual',
              itemStyle: { color: s.primary },
              areaStyle: { color: 'rgba(163, 230, 53, 0.2)' },
            },
          ],
        },
      ],
    };
  }

  ngOnDestroy() {
    this.charts.forEach((chart) => chart.dispose());
  }
}
