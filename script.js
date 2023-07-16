let ExistWord=[];
class Word{
    Origin;
    Num;//0~
    Letter;
    top;
    left;
    size;
    color;
    constructor(or,nu,le){
        this.Origin=or;
        this.Num=nu;
        this.Letter=le;
        this.top=0;
        this.left=0;
        this.size=10;
        this.color=[0,0,0];

        this.Create();
    }
    Create(){
        let tgt=document.createElement("div");
        tgt.setAttribute("class","ExistWord");
        tgt.style.fontSize=this.size+"px";
        tgt.style.top=this.top;
        tgt.style.left=this.left;
        tgt.style.color="rgb("+this.color[0]+","+this.color[1]+","+this.color[2];
        document.body.appendChild(tgt);
    }
}
window.onload=function(){
    for(let i=0;i<3;i++){
        WordFall();
    }
    console.log(ExistWord);

}


function WordFall(){
    let index=Math.floor(Math.random()*(WordList.length));
    console.log(WordList[index]);
    let WordArray=WordList[index][0].split("");
    for(let i=0;i<WordArray.length;i++){
        let NewWord=new Word(WordList[i][0],i,WordArray[i]);
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