<script lang="ts">
import { Line } from "vue-chartjs";
import { Component, Vue } from "vue-property-decorator";
import { colors } from "quasar";
import { Taxa } from "@/model";
import { GraficoStore } from "@/store";
import { GraficoAlcance, GraficoMode } from "@/enum";

const { getPaletteColor } = colors;

const pallete = {
  positive: "light-green",
  negative: "red",
  multi: [
    "light-blue-3",
    "amber-5",
    "blue-grey-4"
  ]
};

function prepareGraph(nVal: Array<{ data: Date, rate: Taxa }>, context: Grafico) {
  const data = {};

  const dataSet = ((range, set) => {
    switch (range) {
      case GraficoAlcance.SEMANA:
        return set.slice(-5);
      case GraficoAlcance.QUINZENA:
        return set.slice(-10);
      case GraficoAlcance.MES:
        return set.slice(-20);
      case GraficoAlcance.BIMESTRE:
        return set.slice(Math.ceil(set.length / 6) * -1);
      case GraficoAlcance.TRIMESTRE:
        return set.slice(Math.ceil(set.length / 4) * -1);
      case GraficoAlcance.SEMESTRE:
        return set.slice(Math.ceil(set.length / 2) * -1);
      case GraficoAlcance.ANO:
      default:
        return set;
    }
  })(context.alcance, nVal);

  data.labels = dataSet.map(x => x.data.toLocaleDateString());
  data.datasets = [];
  data.datasets.lenght = Object.keys(dataSet[0].rate).length;

  console.log(data.datasets.lenght);

  if (data.datasets.lenght > 1) {
    context.$store.commit("setMode", GraficoMode.MULTI_SYMBOL);
  } else if (context.$store.state.mode !== GraficoMode.SINGLE_SYMBOL) {
    context.$store.commit("setMode", GraficoMode.SINGLE_SYMBOL);
  }

  let color = colors.hexToRgb(getPaletteColor(pallete.positive));

  if (context.$store.state.mode == GraficoMode.SINGLE_SYMBOL &&
    dataSet[0].rate[Object.keys(dataSet[0].rate)[0]] > dataSet[dataSet.length - 1].rate[Object.keys(dataSet[0].rate)[0]]) {
    color = colors.hexToRgb(getPaletteColor(pallete.negative));
  }

  let gradient = context.$refs.canvas.getContext("2d").createLinearGradient(0, 0 , 0, 300);
  gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
  gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.0)`);

  for (let i = 0; i < Object.keys(dataSet[0].rate).length; i++) {
    if (context.$store.state.mode == GraficoMode.MULTI_SYMBOL) {
      color = colors.hexToRgb(getPaletteColor(pallete.multi[i]));
    }

    const gradient = context.$refs.canvas.getContext("2d").createLinearGradient(0, 0 , 0, 300);
    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.0)`);

    const moeda = Object.keys(dataSet[0].rate)[i];
    data.datasets[i] = {
      label: moeda,
      data: dataSet.map(x => x.rate[moeda]),
      backgroundColor: gradient,
      borderColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
      borderWidth: 1
    };
  }

  return data;
}

@Component({
  extends: Line,
  store: GraficoStore,
  props: {
    historico: Array,
    alcance: GraficoAlcance
  },
  computed: {
    graphData() {
      return this.$store.state.data;
    },
    graphOptions() {
      return this.$store.state.options;
    }
  },
  watch: {
    historico: function(nVal: Array<{ data: Date, rate: Taxa }>, oVal: Array<{ data: Date, rate: Taxa }>) {
      this.$store.commit("updateData", prepareGraph(nVal, this));
      this.renderChart(this.graphData, this.graphOptions);
    },
    alcance: function() {
      this.updateChart();
    }
  },
  mounted() {
    let opts = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          display: false,
          color: "rgba(0,0,0,0.05)",
          ticks: {
            display: false
          }
        }],
        yAxes: [{
          display: false
        }],
        x: {
          display: false
        },
        y: {
          display: false
        }
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 4
        }
      },
      legend: {
        display: false
      }
    };

    this.$store.commit("updateOptions", opts);
    this.renderChart(this.graphData, this.graphOptions);
  },
  methods: {
    updateChart: function() {
      this.$store.commit("updateData", prepareGraph(this.historico, this));
      this.renderChart(this.graphData, this.graphOptions);
    }
  }
})
export default class Grafico extends Vue {}
</script>

<style scoped>

</style>
