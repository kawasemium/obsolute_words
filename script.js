let ExistWord=[];
class Word{
    Origin;
    Num;//0~
    Letter;
    Top;
    Left;
    Size;
    Color;
    IsFalling;
    constructor(or,nu,le){
        this.Origin=or;
        this.Num=nu;
        this.Letter=le;
        this.Top=0;
        this.Left=0;
        this.Size=20;
        this.Color=[255,255,255];
        this.IsFalling=true;

        this.Create();
    }
    Update(){
        if(this.IsFalling){
            this.Fall();
        }else{

        }
    }
    Create(){
        let tgt=document.createElement("div");
        tgt.className="ExistWord";
        tgt.style.fontSize=this.Size+"px";
        tgt.style.top=this.Top;
        tgt.style.left=this.Left;
        tgt.style.color="rgb("+this.Color[0]+","+this.Color[1]+","+this.Color[2];
        tgt.innerText=this.Letter;
        document.body.appendChild(tgt);
    }
    Fall(){
        
    }
}

window.onload=function(){
    for(let i=0;i<3;i++){
        WordFall();
    }
    console.log(ExistWord);

    //UpdateTimer=setInterval(Update,100);
}
function Update(){
    console.log("Update");
}

function WordFall(){
    let index=Math.floor(Math.random()*(WordList.length));
    console.log(WordList[index]);
    let WordArray=WordList[index][0].split("");
    for(let i=0;i<WordArray.length;i++){
        let NewWord=new Word(WordList[index][0],i,WordArray[i]);
        ExistWord.push(NewWord);
    }
}

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