let ExistWord=[];
let HeightMargin=50;

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
    IsDragging;
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
        this.Color=[255,255,255];

        this.IsDragging=false;
        this.IsFalling=true;
        this.FallingSpeed=20;

        this.Create();
    }
    Update(){
        if(this.IsFalling){
            this.Fall();
        }else{

        }
        this.ReSetting();
    }
    Create(){
        this.Element=document.createElement("div");
        this.Element.className="ExistWord";
        this.Element.innerText=this.Letter;
        this.Element.setAttribute("ExistIndex",this.ExistIndex);
        this.Element.addEventListener("mousedown",this.Drag);
        //this.Element.addEventListener("mouseup",this.Put);
        this.ReSetting();
        document.body.appendChild(this.Element);
    }
    Fall(){
        this.Top+=this.FallingSpeed;
    }
    ReSetting(){
        this.Element.style.top=this.Top+"px";
        this.Element.style.left=this.Left+"px";
        this.Element.style.fontSize=this.Size+"px";
        this.Element.style.color="rgb("+this.Color[0]+","+this.Color[1]+","+this.Color[2];
    }
    Drag(){
        let index=this.getAttribute("ExistIndex");
        ExistWord[index].IsFalling=false;
    }
}

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

$(document).mousedown(function(e){
    e.preventDefault();
    if(e.target.getAttribute("class")){
        console.log(1);
    }
})
$(document).mouseup(function(e){
    e.preventDefault();
    ExistWord.forEach(function(w,i){
        w.IsDragging=false;
    })
})



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