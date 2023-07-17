let ExistWord=[];
let HeightMargin=50;
let mouseX=0,mouseY=0;

/*
just an letter can be stopped
*/ 

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
            this.Drag();
        }
        this.ReSetting();
    }
    Create(){
        this.Element=document.createElement("div");
        this.Element.className="ExistWord";
        this.Element.innerText=this.Letter;
        this.Element.setAttribute("ExistIndex",this.ExistIndex);
        //this.Element.addEventListener("mouseover",this.MouseOver(this.ExistIndex));
        //this.Element.addEventListener("mouseout",this.MouseOut());
        //this.Element.addEventListener("mousedown",this.MouseDown);
        //this.Element.addEventListener("mouseup",this.MouseUp());*/
        this.ReSetting();
        document.body.appendChild(this.Element);
    }
    ReSetting(){
        this.Element.style.top=this.Top+"px";
        this.Element.style.left=this.Left+"px";
        this.Element.style.fontSize=this.Size+"px";

        if(!this.IsFalling){
            this.Element.style.color="rgba("+this.Color[0]+","+this.Color[1]+","+this.Color[2]+","+this.Color[3];
        }
    }

    Fall(){
        this.Top+=this.FallingSpeed;
    }
    Drag(){
        if(this.IsTarget){
            this.Top=mouseY;
            this.Left=mouseX;
        }else{
            let moveX=mouseX-this.Left;
            let moveY=mouseY-this.Top;
            let Distance=Math.sqrt(Math.pow(moveX,2)+Math.pow(moveY,2));
            if(Distance>this.Size*this.FromTarget){
                this.Left+=moveX/2;
                this.Top+=moveY/2;
            }
        }
    }

    MouseOver(index){
        this.FindFamily().forEach(function(w,i){
            w.IsHovering=true;
        })
    }
    MouseOut(){
        //console.log(this.ExistIndex+" is Outed");
    }
    MouseDown(){
        this.IsTarget=true;
        let TargetNum=this.Num;
        this.FindFamily().forEach(function(w,i){
            w.IsFalling=false;
            w.IsDragging=true;
            w.FromTarget=Math.abs(w.Num-TargetNum);
        });
    }
    MouseUp(){
    }

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
// main functions
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
    if(w.Top>document.body.clientHeight+HeightMargin){
        w.Element.remove();
        delete w;
        delete ExistWord[i];
    }
    //ExistWord=ExistWord.filter(Boolean);
}

//==============================
// events
//==============================

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
// DataBase
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