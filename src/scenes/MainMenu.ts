import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.DOMElement;
  startText: GameObjects.Text;

  constructor() {
    super('MainMenu');
  }

  create() {
    this.background = this.add.image(512, 384, 'background');

    // this.logo = this.add.image(512, 300, 'logo');
    // 添加标题 "西游记"
    const titleHtml = `
      <div class="rotating-text">
        斗战西游
      </div>
    `;
    this.title = this.add.dom(512, 300).createFromHTML(titleHtml).setOrigin(0.5);




    this.startText = this.add.text(512, 480, '开始游戏', {
      fontFamily: 'Arial Black',
      fontSize: 38,
      stroke: '#000000',
      strokeThickness: 8,
      color: '#FFFFFF',
      align: 'center'
    }).setOrigin(0.5);

    this.startText.setInteractive();
    this.startText.on('pointerover', () => {
      this.startText.setScale(1.1);
      this.startText.setColor('#FFD799');
      this.startText.setStyle({ cursor: 'pointer' });
    });
    this.startText.on('pointerout', () => {
      this.startText.setScale(1);
      this.startText.setColor('#FFFFFF');
      this.startText.setStyle({ cursor: 'default' });
    });
    this.startText.on('pointerdown', () => {
      this.scene.start('Game');
    });
  }
}
