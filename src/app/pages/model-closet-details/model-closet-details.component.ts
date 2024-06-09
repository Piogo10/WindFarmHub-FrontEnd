import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../services/error.service';

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

  constructor(private errorService: ErrorService) { }

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
}