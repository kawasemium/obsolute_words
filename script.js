let ExistWord=[];
let HeightMargin=document.body.clientHeight*1.2;
let mouseX=0,mouseY=0;

//==============================
// 1.class
//==============================

class Word{
    Element;
    ExistIndex;
    Origin;
    Num;//0~
    Letter;
    Top;
    Left;
    Size;
    Color;
    IsHovering;
    IsDragging;
    DragPointX;
    DragPointY;
    IsTarget;
    FromTarget;//0, 1, ...
    IsFalling;
    FallingSpeed;
    constructor(ind,or,nu,ler,lef){
        this.ExistIndex=ind;
        this.Origin=or;
        this.Num=nu;
        this.Letter=ler;
        this.Top=-HeightMargin+this.Num*20;
        this.Left=lef;
        this.Size=20;
        this.Color=[255,255,255,0.5];

        this.IsHovering=false;
        this.IsDragging=false;
        this.DragPointX=0;//Deviate; needed to + mouseX
        this.DragPointY=0;
        this.IsTarget=false;
        this.FromTarget=1;
        this.IsFalling=true;
        this.FallingSpeed=20;

        this.Create();
    }
    Update(){
        if(this.IsFalling){
            this.Fall();
        }else if(this.IsDragging){
            this.Size*=1.01;
            this.Drag();
        }
        this.ReSetting();
    }
    Create(){
        this.Element=document.createElement("div");
        this.Element.className="ExistWord";
        this.Element.innerText=this.Letter;
        this.Element.setAttribute("ExistIndex",this.ExistIndex);
        this.ReSetting();
        document.body.appendChild(this.Element);
    }
    ReSetting(){
        this.Element.style.top=this.Top+"px";
        this.Element.style.left=this.Left+"px";
        this.Element.style.fontSize=this.Size+"px";

        if(!this.IsFalling){
            this.Element.style.color="rgba("+this.Color[0]+","+this.Color[1]+","+this.Color[2]+","+this.Color[3];
        }else if(this.IsHovering){
            this.Element.style.color="rgba(255,255,255,1)";
        }else{
            this.Element.style.color="rgba(255,255,255,0.5)";
        }
    }

    Fall(){
        this.Top+=this.FallingSpeed;
    }
    Drag(){
        if(this.IsTarget){
            if(mouseY+this.DragPointY-this.Top>document.body.clientHeight*0.3){
                this.Exclude();
                return;
            }
            let Degree=Math.abs(mouseX+this.DragPointX-this.Left);
            if(Degree>document.body.clientWidth*0.3){
                this.Shake(Degree/(document.body.clientWidth*0.3));
            }
            this.Top=mouseY+this.DragPointY;
            this.Left=mouseX+this.DragPointX;
        }else{
            let moveX=mouseX-this.Left;
            let moveY=mouseY-this.Top;
            let Distance=Math.sqrt(Math.pow(moveX,2)+Math.pow(moveY,2));
            let Speed=Distance-1.5*this.Size*this.FromTarget;
            if(Speed>0){
                if(Speed<200)Speed*=0.003;
                else Speed*=0.001;
                Speed/=this.FromTarget;
                this.Left+=moveX*Speed;
                this.Top+=moveY*Speed;
            }
        }
    }
    Shake(deg){
        // 1 < deg < 3
        // For developer tool, 3 -> About 5
        console.log(deg);
    }
    Exclude(){
        this.FindFamily().forEach(function(w,i){
            w.IsDragging=false;
            w.IsTarget=false;
            w.IsFalling=true;
        })
    }

    MouseOver(){
        this.FindFamily().forEach(function(w,i){
            w.IsHovering=true;
        })
    }
    MouseOut(){
        this.FindFamily().forEach(function(w,i){
            w.IsHovering=false;
        })
    }
    MouseDown(){
        this.IsTarget=true;
        let TargetNum=this.Num;
        this.DragPointX=this.Left-mouseX;
        this.DragPointY=this.Top-mouseY;
        this.FindFamily().forEach(function(w,i){
            w.IsFalling=false;
            w.IsDragging=true;
            w.FromTarget=Math.abs(w.Num-TargetNum);
        })
    }
    //MouseUp() -> 3.events

    FindFamily(){
        let Arr=[];
        let Cnt=this.Origin.length;
        let From=this.ExistIndex-this.Num;
        for(let i=From;i<From+Cnt;i++){
            Arr.push(ExistWord[i]);
        }
        return Arr;
    }
}

//==============================
// 2.main functions
//==============================

window.onload=function(){
    UpdateTimer=setInterval(Update,100);
}
function Update(){
    let FallRate=5;
    if(Math.floor(Math.random()*FallRate)==0)WordFall();

    ExistWord.forEach(function(w,i){
        w.Update();
        WordCleaner(w,i);
    })
}

function WordFall(){
    let index=Math.floor(Math.random()*(WordList.length));
    let lef=Math.floor(Math.random()*(document.body.clientWidth));
    let WordArray=WordList[index][0].split("");
    WordArray.forEach(function(letter,i){
        let NewWord=new Word(ExistWord.length,WordList[index][0],i,letter,lef);
        ExistWord.push(NewWord);
    })
}

function WordCleaner(w,i){
    if(w.Top>document.body.clientHeight+HeightMargin && w.IsFalling){
        w.Element.remove();
        delete w;
        delete ExistWord[i];
    }
    //ExistWord=ExistWord.filter(Boolean);
}

//==============================
// 3.events
//==============================
$(window).resize(function(){
    HeightMargin=document.body.clientHeight*1.2;
})

$(document).mousedown(function(e){
    e.preventDefault();
    let index=GetExistIndex(e.target);
    if(index!==""){
        ExistWord[index].MouseDown();
    }
})
$(document).mouseover(function(e){
    let index=GetExistIndex(e.target);
    if(index!==""){
        ExistWord[index].MouseOver();
    }
})
$(document).mouseout(function(e){
    let index=GetExistIndex(e.target);
    if(index!==""){
        ExistWord[index].MouseOut();
    }
})
$(document).mouseup(function(e){
    e.preventDefault();
    ExistWord.forEach(function(w,i){
        w.IsDragging=false;
        w.IsTarget=false;
    })
})
$(document).mousemove(function(e){
    e.preventDefault();
    mouseX=e.clientX;
    mouseY=e.clientY;
})

function GetExistIndex(ele){
    if(ele.getAttribute("class")=="ExistWord"){
        return ele.getAttribute("ExistIndex");
    }else{
        return "";
    }
}

//==============================
// 4.DataBase
//==============================

let WordList = [
    //[0]"word", [1]period
    ["abc", 1950],
    ["bcd",1950],
    ["cde",1950],
    ["def",1950],
    ["efg",1950],
    ["fgh",1950],
    ["ghi",1950],
    ["hij",1950],
    ["ijk",1950],
    ["jkl",1950],
    ["klm",1950],
    ["lmn",1950],
    ["mno",1950],
    ["nop",1950],
    ["opq",1950],
    ["pqr",1950],
    ["qrs",1950],
    ["rst",1950],
    ["stu",1950],
    ["tuv",1950]
]