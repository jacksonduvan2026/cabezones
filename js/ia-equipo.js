class TeamAI{
 static read(p,g,dt){const direction=p.team===0?1:-1,b=g.ball,d=g.config.aiLevel||.82,a={};p.aiCooldown-=dt;const teammates=g.players.filter(q=>q.team===p.team&&q!==p);const closer=teammates.some(q=>Math.abs(q.x-b.x)<Math.abs(p.x-b.x)-35);let target=clamp(b.x+b.vx*(.13+.16*d)-direction*48,110,1090);
 if(closer&&p.role==='support')target=clamp(b.x-direction*210,150,1050);if(Math.abs(p.x-target)>18){a.left=p.x>target;a.right=p.x<target}const dist=Math.abs(b.x-p.x);
 if(p.grounded&&dist<95+50*d&&b.y<p.headY-22&&b.y>160&&p.aiCooldown<=0){a.jumpPressed=true;p.aiCooldown=.25+(1-d)*.7}
 if(dist<130&&b.y>p.y-165&&p.aiCooldown<=0){p.face=direction;if(!p.aiCharge)p.aiCharge=.18+(1-d)*.4}if(p.aiCharge>0){p.aiCharge-=dt;a.kick=true;if(p.aiCharge<=0){a.kick=false;a.kickReleased=true;p.aiCooldown=.2+(1-d)*.65}}
 if(Skills.ai(p,g)){p.face=direction;a.specialPressed=true}if(d>.7&&dist<85&&b.y>FLOOR-35&&p.slideCD<=0&&b.vx*direction< -130){a.tacklePressed=true;p.face=direction}return a}
}
// ─── Tanda interactiva: cinco tiros, cierre anticipado y muerte súbita. ───
