import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-choose-players',
  templateUrl: './choose-players.component.html',
  styleUrls: ['./choose-players.component.css']
})
export class ChoosePlayersComponent {
  players: any[] = [];
  modalTitle: string;
  selectedPlayers: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChoosePlayersComponent>
  ) {
    this.players = this.data?.players || [];
    this.modalTitle = this.data?.modalTitle || '';
  }

  selectPlayer(event: any, cellNumber: number) {
    const selectedPlayer = event.target.value;
    if (selectedPlayer) {
      this.selectedPlayers[cellNumber - 1] = selectedPlayer;
    } else {
      delete this.selectedPlayers[cellNumber - 1];
    }
  }

  closeModal() {
    this.selectedPlayers = this.selectedPlayers.filter(player => player);
    this.dialogRef.close(this.selectedPlayers);
  }
}
