class PausaScene extends Phaser.Scene {
 constructor() { super('pausa'); }
 create() {
  this.cameras.main.setZoom(1);
  const texture = this.textures.exists('partido-canvas') ? this.textures.get('partido-canvas') : this.textures.addCanvas('partido-canvas', document.getElementById('pitch'));
  this.add.image(600, 325, 'partido-canvas').setDisplaySize(1200, 650);
 }
 update() { this.textures.get('partido-canvas')?.refresh(); }
}
