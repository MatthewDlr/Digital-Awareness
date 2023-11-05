import { Component } from '@angular/core';
import { CommandPaletteService } from '../../services/command-palette/command-palette.service';

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css']
})
export class CommandPaletteComponent {

  constructor(
    private commandPaletteService: CommandPaletteService
  ){}

  toggleCommandPalette(state:boolean){
    this.commandPaletteService.toggleCommandPalette(state)
  }
}
