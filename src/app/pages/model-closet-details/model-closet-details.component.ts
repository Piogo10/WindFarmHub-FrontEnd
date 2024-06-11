import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { TranslationService } from '../../services/translation.service';
import { AnimationsService } from '../../services/animations.service';

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
  errorMessages: ErrorMessage[] = [];
  solutions: Solution[] = [];
  results: { error_message: string; solutions: { topic: string; descriptions: string[] }[] }[] = [];
  showResults: boolean = false;
  selectedResult: { error_message: string; solutions: { topic: string; descriptions: string[] }[] } | null = null;

  constructor(
    private errorService: ErrorService,
    private translationService: TranslationService,
    private animationsService: AnimationsService,
  ) { }

  ngOnInit() {
    this.errorService.getErrorMessagesAndSolutions().subscribe(
      data => {
        this.errorMessages = data.errors;
        this.solutions = data.solutions;
      },
      error => console.error('Error:', error)
    );
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
        { type: 'PDF', label: 'CSC_Customer', file: 'a' },
        { type: 'PDF', label: 'CMW_messages_V1', file: 'a' },
      ]
    },
    {
      title: 'Programas',
      items: [
        { type: 'EXE', label: 'Data Visualizer', file: 'a' },
        { type: 'EXE', label: 'WuT ComServer', file: 'a' },
      ]
    },
    {
      title: 'Esquema Elétrico',
      items: [
        { type: 'EXE', label: 'SVG', file: 'a' },
        { type: 'PDF', label: 'PDF', file: 'a' },
      ]
    },
    {
      title: 'Componentes',
      items: [
        { type: 'EXE', label: 'XML', file: 'a' },
        { type: '', label: 'JSON', file: 'a' },
      ]
    },
  ];

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
}