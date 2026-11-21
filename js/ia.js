class AI{
 static read(p,g,dt){const b=g.ball,d={easy:.58,medium:.82,hard:1}[g.config.difficulty]||.82;const a={};p.aiCooldown-=dt;const prediction=clamp(b.x+b.vx*(.13+.16*d),115,1085);let target=prediction+48;
 if(b.x<420&&b.vx<0)target=800;if(b.x>1000)target=Math.min(1080,b.x+35);if(Math.abs(p.x-target)>16){a.left=p.x>target;a.right=p.x<target}
 const dist=Math.abs(b.x-p.x);if(p.grounded&&dist<95+50*d&&b.y<p.headY-22&&b.y>160&&p.aiCooldown<=0){a.jumpPressed=true;p.aiCooldown=.25+(1-d)*.7}
 if(dist<130&&b.y>p.y-165&&p.aiCooldown<=0){p.face=-1;if(!p.aiCharge)p.aiCharge=.18+(1-d)*.4}
 if(p.aiCharge>0){p.aiCharge-=dt;a.kick=true;if(p.aiCharge<=0){a.kick=false;a.kickReleased=true;p.aiCooldown=.2+(1-d)*.65}}
 if(Skills.ai(p,g)){p.face=-1;a.specialPressed=true}
 if(d>.7&&dist<85&&b.y>FLOOR-35&&p.slideCD<=0&&b.vx>130){a.tacklePressed=true;p.face=-1}return a}
}
// ─── Física: paso fijo a 120 Hz y subpasos para evitar atravesar postes. ───
