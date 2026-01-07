import {
  Component,
  computed,
  effect,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import * as echarts from 'echarts';
import { KPI } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'report-page',
  standalone: true,
  templateUrl: './report-page.html',
})
export class ReportPage implements OnDestroy {
  private trendChartDom = viewChild<ElementRef>('trendChart');
  private priorityChartDom = viewChild<ElementRef>('priorityChart');
  private slaChartDom = viewChild<ElementRef>('slaChart');
  private agentsChartDom = viewChild<ElementRef>('agentsChart');
  private efficiencyChartDom = viewChild<ElementRef>('efficiencyChart');

  public userRole = computed(() => this._authService.getUserInfo().role);
  public isAdmin = computed(() => this.userRole() === 'ADMIN');

  private charts: echarts.ECharts[] = [];

  public totalTickets = signal(951);
  public slaCompliance = signal(94.4);
  public avgResolutionTime = signal('19m 20s');
  public resolvedCount = signal(128);
  public openTickets = signal(5);
  public totalAssigned = signal(25);

  public adminKpis = computed<KPI[]>(() => [
    {
      id: 'total',
      label: $localize`:@@reports.kpi_total:Total Tickets`,
      val: this.totalTickets(),
      color: 'text-base-content',
    },
    {
      id: 'sla',
      label: $localize`:@@reports.kpi_sla:SLA Global`,
      val: `${this.slaCompliance()}%`,
      color: 'text-primary',
    },
    {
      id: 'resolution',
      label: $localize`:@@reports.kpi_resolution:Resolución Promedio`,
      val: this.avgResolutionTime(),
      color: 'text-base-content',
    },
    {
      id: 'satisfaction',
      label: $localize`:@@reports.kpi_satisfaction:Satisfacción`,
      val: '4.8/5',
      color: 'text-success',
    },
  ]);

  public agentKpis = computed<KPI[]>(() => [
    {
      id: 'resolved',
      label: $localize`:@@agent_reports.kpi_resolved:Tickets Resueltos`,
      val: this.resolvedCount(),
      color: 'text-base-content',
    },
    {
      id: 'my_sla',
      label: $localize`:@@agent_reports.kpi_my_sla:Mi Cumplimiento SLA`,
      val: '94%',
      color: 'text-primary',
    },
    {
      id: 'my_speed',
      label: $localize`:@@agent_reports.kpi_my_speed:Tiempo de Respuesta`,
      val: '1h 20m',
      color: 'text-base-content',
    },
    {
      id: 'my_rating',
      label: $localize`:@@agent_reports.kpi_my_rating:Mi Calificación`,
      val: '4.9/5',
      color: 'text-success',
    },
  ]);

  public openPercentage = computed(() =>
    this.totalAssigned() > 0 ? (this.openTickets() * 100) / this.totalAssigned() : 0
  );

  constructor(private _authService: AuthService) {
    effect(() => {
      const resizeObserver = new ResizeObserver(() => this.charts.forEach((c) => c.resize()));
      resizeObserver.observe(document.body);
    });

    effect(() => {
      if (this.trendChartDom()) {
        setTimeout(() => this.initCharts(), 50);
      }
    });
  }

  private initCharts() {
    this.charts.forEach((c) => c.dispose());
    this.charts = [];
    const s = { primary: '#a3e635', secondary: 'rgba(0, 211, 113, 0.45)', grid: '#27272a' };

    this.renderChart(this.trendChartDom(), this.getTrendOption(s));

    this.renderChart(this.priorityChartDom(), this.getPriorityOption(s, this.isAdmin()));

    if (this.isAdmin()) {
      this.renderChart(this.slaChartDom(), this.getSlaOption(s));
      this.renderChart(this.agentsChartDom(), this.getAgentsOption(s));
      this.renderChart(this.efficiencyChartDom(), this.getEfficiencyOption(s));
    } else {
      this.renderChart(this.slaChartDom(), this.getAgentCategoriesOption(s));
      this.renderChart(this.efficiencyChartDom(), this.getAgentSatisfactionOption(s));
    }
  }

  private getPriorityOption(s: any, isAdmin: boolean) {
    const adminData = [
      { value: 401, name: $localize`:@@priority.low:Baja`, itemStyle: { color: '#a3cf22' } },
      { value: 245, name: $localize`:@@priority.medium:Media`, itemStyle: { color: '#fbbf24' } },
      { value: 125, name: $localize`:@@priority.high:Alta`, itemStyle: { color: '#f97316' } },
      {
        value: 180,
        name: $localize`:@@priority.critical:Crítica`,
        itemStyle: { color: '#ff4444' },
      },
    ];

    const agentData = [
      { value: 65, name: $localize`:@@priority.low:Baja`, itemStyle: { color: '#a3cf22' } },
      { value: 40, name: $localize`:@@priority.medium:Media`, itemStyle: { color: '#fbbf24' } },
      { value: 21, name: $localize`:@@priority.high:Alta`, itemStyle: { color: '#f97316' } },
      { value: 12, name: $localize`:@@priority.critical:Crítica`, itemStyle: { color: '#ff4444' } },
    ];

    return {
      backgroundColor: 'transparent',

      tooltip: {
        show: false,
      },
      legend: {
        orient: 'horizontal',
        bottom: '0',
        textStyle: { color: '#94a3b8', fontSize: 10 },
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          name: isAdmin ? 'Total Tickets' : 'Mis Tickets',
          type: 'pie',
          radius: ['42%', '75%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 10 },

          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#EEEEEE',
          },
          labelLine: {
            show: false,
          },
          data: isAdmin ? adminData : agentData,
        },
      ],
    };
  }

  private renderChart(el: ElementRef | undefined, option: any) {
    if (el?.nativeElement) {
      const chart = echarts.init(el.nativeElement, 'dark');
      chart.setOption(option);
      this.charts.push(chart);
    }
  }

  ngOnDestroy() {
    this.charts.forEach((c) => c.dispose());
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
          itemStyle: { color: '#fbbf24' },
          areaStyle: { color: '#fbbf24' },
        },
      ],
    };
  }

  private getSlaOption(s: any) {
    const rawData = [
      { name: 'Seguridad', value: 94 },
      { name: 'UI', value: 85 },
      { name: 'Red', value: 92 },
      { name: 'Apps', value: 99 },
    ];

    const sortedData = rawData.sort((a, b) => a.value - b.value);

    return {
      backgroundColor: 'transparent',
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value', splitLine: { show: false } },
      yAxis: {
        type: 'category',
        data: sortedData.map((d) => d.name),
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: sortedData.map((d) => d.value),

          itemStyle: { color: '#f97316', borderRadius: [0, 5, 5, 0] },
          label: { show: true, position: 'right', formatter: '{c}%', color: '#94a3b8' },
        },
      ],
    };
  }

  private getAgentsOption(s: any) {
    const rawData = [
      { name: 'Ana', value: 45 },
      { name: 'Luis', value: 38 },
      { name: 'Karla', value: 52 },
      { name: 'Juan', value: 30 },
    ];

    const sortedData = rawData.sort((a, b) => b.value - a.value);

    return {
      backgroundColor: 'transparent',
      xAxis: {
        type: 'category',
        data: sortedData.map((d) => d.name),
        axisTick: { show: false },
      },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: s.grid } } },
      series: [
        {
          type: 'bar',
          data: sortedData.map((d) => d.value),
          itemStyle: { color: '#f97316', borderRadius: [5, 5, 0, 0] },
        },
      ],
    };
  }

  private getEfficiencyOption(s: any) {
    return {
      backgroundColor: 'transparent',
      radar: {
        indicator: [
          { name: 'Vel.', max: 100 },
          { name: 'SLA', max: 100 },
          { name: 'Feedback', max: 100 },
        ],
        splitArea: { show: false },
      },
      series: [{ type: 'radar', data: [{ value: [80, 95, 90], itemStyle: { color: '#f97316' } }] }],
    };
  }

  private getAgentCategoriesOption(s: any) {
    const rawData = [
      { name: 'Soporte', value: 45 },
      { name: 'Ventas', value: 22 },
      { name: 'Técnico', value: 63 },
    ];

    const sortedData = rawData.sort((a, b) => b.value - a.value);

    return {
      backgroundColor: 'transparent',
      xAxis: {
        type: 'category',
        data: sortedData.map((d) => d.name),
        axisLine: { show: false },
      },
      yAxis: { type: 'value', splitLine: { show: false } },
      series: [
        {
          type: 'bar',
          data: sortedData.map((d) => d.value),
          itemStyle: { color: '#f97316', borderRadius: 5 },
        },
      ],
    };
  }

  private getAgentSatisfactionOption(s: any) {
    return {
      backgroundColor: 'transparent',
      xAxis: { type: 'category', data: ['S1', 'S2', 'S3', 'S4'], axisLine: { show: false } },
      yAxis: { type: 'value', min: 0, max: 5 },
      series: [
        { type: 'line', smooth: true, data: [4.2, 4.5, 4.8, 4.9], itemStyle: { color: '#f97316' } },
      ],
    };
  }
}
