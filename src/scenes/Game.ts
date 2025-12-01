import { Scene } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  titleText: Phaser.GameObjects.Text;
  character: Phaser.GameObjects.Sprite;
  enemies: Phaser.GameObjects.Group;
  score: number;
  scoreText: Phaser.GameObjects.Text;
  gameActive: boolean;

  constructor() {
    super('Game');
    this.score = 0;
    this.gameActive = true;
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x1a472a);

    this.background = this.add.image(512, 384, 'background');
    this.background.setAlpha(0.3);

    this.titleText = this.add.text(512, 50, '孙悟空大闹天宫', {
      fontFamily: 'Arial Black', fontSize: 48, color: '#FFD700',
      stroke: '#8B4513', strokeThickness: 6,
      align: 'center'
    });
    this.titleText.setOrigin(0.5);

    this.scoreText = this.add.text(20, 20, '得分: 0', {
      fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF',
      stroke: '#000000', strokeThickness: 3
    });

    this.character = this.add.sprite(512, 600, 'logo');
    this.character.setScale(0.5);
    this.character.setInteractive();

    this.enemies = this.add.group();

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.gameActive && this.character) {
        this.character.x = pointer.x;
      }
    });

    this.input.on('pointerdown', () => {
      if (this.gameActive) {
        this.checkEnemyCollisions();
      } else {
        this.scene.start('MainMenu');
      }
    });
  }

  spawnEnemy() {
    if (!this.gameActive) return;

    const x = Phaser.Math.Between(100, 924);
    const enemy = this.add.sprite(x, -50, 'logo');
    enemy.setScale(0.3);
    enemy.setTint(0xFF0000);
    this.enemies.add(enemy);

    this.tweens.add({
      targets: enemy,
      y: 800,
      duration: Phaser.Math.Between(3000, 5000),
      ease: 'Linear',
      onComplete: () => {
        enemy.destroy();
      }
    });
  }

  checkEnemyCollisions() {
    const characterBounds = this.character.getBounds();
    
    this.enemies.children.entries.forEach((enemy: any) => {
      const enemyBounds = enemy.getBounds();
      
      if (Phaser.Geom.Rectangle.Overlaps(characterBounds, enemyBounds)) {
        this.score += 10;
        this.scoreText.setText(`得分: ${this.score}`);
        enemy.destroy();
        
        this.createScorePopup(enemy.x, enemy.y);
      }
    });
  }

  createScorePopup(x: number, y: number) {
    const popup = this.add.text(x, y, '+10', {
      fontFamily: 'Arial', fontSize: 32, color: '#00FF00',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: popup,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        popup.destroy();
      }
    });
  }

  update() {
    if (this.gameActive && this.score >= 100) {
      this.gameActive = false;
      this.showVictoryMessage();
    }
  }

  showVictoryMessage() {
    const victoryText = this.add.text(512, 384, '恭喜通关！\n点击返回主菜单', {
      fontFamily: 'Arial Black', fontSize: 48, color: '#FFD700',
      stroke: '#8B4513', strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5);

    victoryText.setInteractive();
    victoryText.on('pointerover', () => {
      victoryText.setScale(1.1);
      victoryText.setStyle({ cursor: 'pointer' });
    });
    victoryText.on('pointerout', () => {
      victoryText.setScale(1);
      victoryText.setStyle({ cursor: 'default' });
    });
  }
}