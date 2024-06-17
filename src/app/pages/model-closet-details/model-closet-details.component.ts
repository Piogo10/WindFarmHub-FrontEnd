import { Component, HostListener, OnInit } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { TranslationService } from '../../services/translation.service';
import { AnimationsService } from '../../services/animations.service';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ItemService } from '../../services/item.service';

interface ErrorMessage {
  id: number;
  error_message: string;
}

interface Solution {
  id: number;
  error_id: number;
  topic: string;
  description: string;
  check_level: string;
  step_order: number;
  urgent_service: boolean;
}

@Component({
  selector: 'app-model-closet-details',
  templateUrl: './model-closet-details.component.html',
  styleUrls: ['./model-closet-details.component.scss']
})
export class ModelClosetDetailsComponent implements OnInit {

  query: string = '';
  products: any[] = [];
  errorMessages: ErrorMessage[] = [];
  solutions: Solution[] = [];
  results: { error_message: string; solutions: { topic: string; descriptions: string[] }[] }[] = [];
  showResults: boolean = false;
  selectedResult: { error_message: string; solutions: { topic: string; descriptions: string[] }[] } | null = null;


  componentes = [
    { id: 'baterias', number: '50040558', imgSrc: 'assets/images/Eco-80/power-convertor/baterias.jpg', name: 'Baterias', stock: null },
    { id: 'botao_comando', number: '', imgSrc: 'assets/images/Eco-80/power-convertor/botao_comando.jpg', name: 'Botão do Comando', stock: null },
    { id: 'contador_lado', number: '20176155', imgSrc: 'assets/images/Eco-80/power-convertor/contador_lado.jpg', name: 'Contactor de Lado', stock: null },
    { id: 'contador_potencia', number: '50038692', imgSrc: 'assets/images/Eco-80/power-convertor/contador_potencia.jpg', name: 'Contactor de Potência', stock: null },
    { id: 'display_cmw1', number: '50065390', imgSrc: 'assets/images/Eco-80/power-convertor/display_cmw1.jpg', name: 'Display CMW1', stock: null },
    { id: 'grupo_IGBTS', number: '50077412', imgSrc: 'assets/images/Eco-80/power-convertor/grupo_IGBTS.jpg', name: 'Grupo IGBT´S', stock: null },
    { id: 'hur', number: '50065383', imgSrc: 'assets/images/Eco-80/power-convertor/hur.jpg', name: 'Hur', stock: 2 },
    { id: 'modelo_bus', number: '50041493', imgSrc: 'assets/images/Eco-80/power-convertor/modelo_bus.jpg', name: 'Modulo BUS', stock: null },
    { id: 'modelo_gm1_r', number: '', imgSrc: 'assets/images/Eco-80/power-convertor/modelo_gm1_r.jpg', name: 'Modulo GM1´R', stock: null },
    { id: 'rotor', number: '50040534', imgSrc: 'assets/images/Eco-80/power-convertor/rotor.jpg', name: 'Relés', stock: null },
    { id: 'sur', number: '50065397', imgSrc: 'assets/images/Eco-80/power-convertor/sur.jpg', name: 'Sur', stock: null },
    { id: 'ventilacao', number: '50042630', imgSrc: 'assets/images/Eco-80/power-convertor/ventilacao.jpg', name: 'Ventilação', stock: null },
  ];

  constructor(
    private errorService: ErrorService,
    private translationService: TranslationService,
    private itemService: ItemService,
    private animationsService: AnimationsService,

  ) { pdfDefaultOptions.assetsFolder = 'bleeding-edge'; }

  ngOnInit() {
    this.errorService.getErrorMessagesAndSolutions().subscribe(
      data => {
        this.errorMessages = data.errors;
        this.solutions = data.solutions;
      },
      error => console.error('Error:', error)
    );

    this.itemService.getAllItems().then(products => {
      this.products = products;
      console.log('products:', this.products);

      this.componentes.forEach(component => {
        console.log('a',component)
        const matchingProduct = this.products.find(product => product.material === component.number);
        console.log('b',matchingProduct);
        if (matchingProduct) {
        component.stock = matchingProduct.stock_count;
        console.log('c',component.stock);
        }
      });
    });
  }


  onSearch() {
    if (!this.query.trim()) {
      this.showResults = false;
      return;
    }
    const lowerQuery = this.query.toLowerCase();
    const filteredErrorMessages = this.errorMessages.filter(errorMessage =>
      errorMessage.error_message.toLowerCase().includes(lowerQuery)
    );

    this.results = filteredErrorMessages.map(errorMessage => {
      const solutionsForError = this.solutions.filter(solution => solution.error_id === errorMessage.id);
      const groupedSolutions = this.groupSolutionsByTopic(solutionsForError);
      return {
        error_message: errorMessage.error_message,
        solutions: groupedSolutions
      };
    });

    this.closeSolution();
    this.showResults = true;
  }

  groupSolutionsByTopic(solutions: Solution[]): { topic: string; descriptions: string[] }[] {
    const uniqueTopics = new Map<string, string[]>();
    solutions.forEach(solution => {
      if (uniqueTopics.has(solution.topic)) {
        uniqueTopics.get(solution.topic)!.push(solution.description);
      } else {
        uniqueTopics.set(solution.topic, [solution.description]);
      }
    });
    return Array.from(uniqueTopics.entries()).map(([topic, descriptions]) => ({
      topic,
      descriptions
    }));
  }

  toggleSolution(result: { error_message: string; solutions: { topic: string; descriptions: string[] }[] }) {
    this.selectedResult = this.selectedResult === result ? null : result;
  }

  closeSolution() {
    this.selectedResult = null;
  }

  activeSection: number = -1;

  sections = [
    {
      title: 'Constumers',
      items: [
        { type: 'PDF', label: 'CSC_Customer', file: 'CSC_Customer.pdf' },
        { type: 'PDF', label: 'CMW_messages_V1', file: 'CMW_messages_V1.pdf' },
      ]
    },
    {
      title: 'Programas',
      items: [
        { type: 'EXE', label: 'Data_Visualizer', file: 'DataVisualizer_KP-RMS_18603.exe' },
        { type: 'EXE', label: 'WuT_ComServer', file: 'e-58135-ww-swww-383.exe' },
      ]
    },
    {
      title: 'Esquema Elétrico',
      items: [
        { type: 'PDF', label: 'CW1670ET14_3_62422BP3-D02_C', file: 'CW1670ET14.3_62422BP3-D02.C.pdf' },
      ]
    },
    {
      title: 'Componentes',
      items: null
    }
  ];

  closetInfo = [
    { "title": "Tipo", "desc": "FU1670ET14.1" },
    { "title": "Número de Comando", "desc": "CD0-42-05U-004" },
    { "title": "Número do Cliente", "desc": "ECO 74" },
    { "title": "Tensão (Rede)", "desc": "690 V" },
    { "title": "Tensão (Gerador)", "desc": "0-750 V" },
    { "title": "Tensão Auxiliar", "desc": "400/230 V" },
    { "title": "Corrente (Rede)", "desc": "400 A" },
    { "title": "Corrente (Gerador)", "desc": "625 A" },
    { "title": "Frequência", "desc": "50 Hz (Rede) / 0-17 Hz (Gerador)" },
    { "title": "Tipo de Enclosure", "desc": "IP 54" },
    { "title": "Temperatura Máxima Ambiente", "desc": "45 °C" },
    { "title": "Capacidade de Curto-Circuito", "desc": "25 kA" },
    { "title": "Ano de Fabricação", "desc": "2006" },
    { "title": "Modelo", "desc": "624Q2BP0.4" },
    { "title": "Fabricante", "desc": "SEG Schaltanlagen-Elektronik-Geräte GmbH & Co. KG" },
  ]


  toggleSection(index: number) {
    this.activeSection = this.activeSection === index ? -1 : index;
  }


  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }

  onMouseEnter(target: string) {
    this.animationsService.scaleAnimation(target, 1.1, 0.5);
  }

  onMouseLeave(target: string) {
    this.animationsService.scaleAnimation(target, 1, 0.5);
  }

  showPDF = false;
  srcComplete: string | null = null;
  fileName: string | null = null;
  isFileDocument: boolean = false;
  scrollHandler!: EventListenerObject;

  tooglePDF(item: any) {
    this.showPDF = !this.showPDF;

    document.body.style.overflow = this.showPDF ? 'hidden' : 'auto';
    const method = this.showPDF ? 'addEventListener' : 'removeEventListener';
    document.body[method]('scroll', this.scrollHandler);

    if (!this.showPDF) {
      this.fileName = null;
      this.isFileDocument = false;
      return;
    }

    if (item == null) return;

    this.fileName = item.file;
    this.srcComplete = `assets/files/eco-80/closets/power-conversor/${item.file}`;
  }

  downloadFile(url: string) {
    const link = document.createElement('a');
    this.srcComplete = `assets/files/eco-80/closets/power-conversor/${url}`;
    link.href = this.srcComplete;
    link.download = url.split('/').pop() || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  handleItemClick(item: any) {
    if (item.type === 'PDF') {
      this.tooglePDF(item);
    } else if (item.type === 'EXE') {
      this.downloadFile(item.file);
    }
  }

  selectedComponent: any;
  componentInfo: any[] = [];
  componentInfoKeys = [
    { label: 'Nome', key: 'text_brief_material' },
    { label: 'Localização', key: 'deposit_denomination' },
    { label: 'SAP', key: 'sap' },
    { label: 'LOTE', key: 'lot' },
    { label: 'Valor Livre de Utilização', key: 'free_utilization_value' },
    { label: 'Moeda', key: 'currency' },
    { label: 'Stock', key: 'stock_count' },
    { label: 'Diferença', key: 'difference' }
  ];

  toggleComponentDetail = false;

  toogleComponentDetails(component: any) {
    this.toggleComponentDetail = !this.toggleComponentDetail;

    document.body.style.overflow = this.toggleComponentDetail ? 'hidden' : 'auto';
    const method = this.toggleComponentDetail ? 'addEventListener' : 'removeEventListener';
    document.body[method]('scroll', this.scrollHandler);

    if (!this.toggleComponentDetail) {
      this.selectedComponent = null;
      this.componentInfo = [];
      return
    }

    this.selectedComponent = component;

    if (this.selectedComponent) {
      const matchingProduct = this.products.find(product => product.material === this.selectedComponent.number);
      if (matchingProduct) {
        this.componentInfo = [matchingProduct];
      } else {
        this.componentInfo = [];
      }
    }
  }


}
