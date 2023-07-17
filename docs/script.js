let Year=new Date().getFullYear();
let ExistWord=[];
let HeightMarginTop=100;
let HeightMarginBottom=document.body.clientHeight*1.2;
let mouseX=0,mouseY=0;

//クリックで年齢表示
//
//データベース作成

//==============================
// 1.class, object
//==============================

class Word{
    Element;
    ExistIndex;
    Period;
    Origin;
    Num;//0~
    Letter;
    Top;
    Left;
    Size;
    Color;
    ColorChangeMode;//ColorChange(); 0~5
    ShakeDegree;//0~255
    IsHovering;
    IsDragging;
    DragPointX;
    DragPointY;
    IsTarget;
    FromTarget;//0, 1, ...
    IsFalling;
    FallingSpeed;
    static FastRatioOfClientHeight=0.3;
    static NonShakeDark=50;//-50
    static ChikachikaDark=40;//-0~40
    static MaxFollowSpeed=0.0015;//*=Speed in Drag()
    static MinFollowSpeed=0.0005;

    constructor(ind,or,period,nu,ler,lef){
        this.ExistIndex=ind;
        this.Origin=or;
        this.Period=period;
        this.Num=nu;
        this.Letter=ler;
        this.Top=-HeightMarginTop+this.Num*20;
        this.Left=lef;
        this.Size=20;
        this.Color=[0,255,255,1];
        this.ColorChangeMode=3;
        this.ShakeDegree=0;

        this.IsHovering=false;
        this.IsDragging=false;
        this.DragPointX=0;//Deviate; needed to + mouseX
        this.DragPointY=0;
        this.IsTarget=false;
        this.FromTarget=1;
        this.IsFalling=true;
        this.FallingSpeed=10;

        this.Create();
    }
    Update(){
        if(this.IsFalling){
            this.Fall();
        }else if(this.IsDragging){
            this.Size*=1.01;
            this.Drag();
        }
        if(!this.IsFalling){
            this.ShakeDegree--;
            if(this.ShakeDegree<0)this.ShakeDegree=0;
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
            let Col=this.MakeShining(this.Color,this.ShakeDegree);
            this.Element.style.color="rgba("+Col[0]+","+Col[1]+","+Col[2]+","+Col[3];
        }else if(this.IsHovering){
            this.Element.style.color="rgba("+this.Color[0]+","+this.Color[1]+","+this.Color[2]+",0.8)";
        }else{
            this.Element.style.color="rgba(255,255,255,0.5)";
        }
    }

    Fall(){
        this.Top+=this.FallingSpeed;
    }
    Drag(){
        if(this.IsTarget){
            if(mouseY+this.DragPointY-this.Top>document.body.clientHeight*Word.FastRatioOfClientHeight){
                this.Exclude();
                return;
            }
            let Degree=Math.abs(mouseX+this.DragPointX-this.Left);
            if(Degree>document.body.clientWidth*Word.FastRatioOfClientHeight){
                this.Shake(Degree/(document.body.clientWidth*Word.FastRatioOfClientHeight));
            }
            this.Top=mouseY+this.DragPointY;
            this.Left=mouseX+this.DragPointX;
        }else{
            let moveX=mouseX-this.Left;
            let moveY=mouseY-this.Top;
            let Distance=Math.sqrt(Math.pow(moveX,2)+Math.pow(moveY,2));
            let SizeDistance=1.5;
            if(this.Size>40)SizeDistance=1.3;
            let Speed=Distance-SizeDistance*this.Size*this.FromTarget;
            if(Speed>0){
                if(Speed<200 && this.Size<50)Speed*=Word.MaxFollowSpeed;
                else Speed*=Word.MinFollowSpeed;
                Speed/=this.FromTarget;
                this.Left+=moveX*Speed;
                this.Top+=moveY*Speed;
            }
        }
    }
    Shake(deg){
        // 1 < deg < 3
        // For developer tool, 3 -> About 5
        this.FindFamily().forEach(function(w,i){
            w.Color=w.ColorChande(deg,w.Color[0],w.Color[1],w.Color[2]);
            w.ShakeDegree+=deg*10;
        })
    }
    ColorChande(deg,r,g,b){
        deg*=20;
        switch(this.ColorChangeMode){
            case 0:
                g+=deg;
                if(g>255){
                    g=255;
                    this.ColorChangeMode++;
                }
                break;
            case 1:
                r-=deg;
                if(r<0){
                    r=0;
                    this.ColorChangeMode++;
                }
                break;
            case 2:
                b+=deg;
                if(b>255){
                    b=255;
                    this.ColorChangeMode++;
                }
                break;
            case 3:
                //first
                g-=deg;
                if(g<0){
                    g=0;
                    this.ColorChangeMode++;
                }
                break;
            case 4:
                r+=deg;
                if(r>255){
                    r=255;
                    this.ColorChangeMode++;
                }
                break;
            case 5:
                b-=deg;
                if(b<0){
                    b=0;
                    this.ColorChangeMode=0;
                }
                break;
            default:
                break;
        }
        let Col=[r,g,b,1];
        return Col;
    }
    MakeShining(rgba,howShaked){
        let Col=[rgba[0],rgba[1],rgba[2],rgba[3]];
        for(let i=0;i<3;i++){
            Col[i]=Col[i]+howShaked-Word.NonShakeDark;
            Col[i]-=Math.floor(Math.random()*Word.ChikachikaDark);

            if(Col[i]>255)Col[i]=255;
            if(Col[i]<0)Col[i]=0;
        }
        return Col;
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

CalcAgeSystem={
    CalcAge:function(){
        let PeList=[];
        ExistWord.forEach(function(w,i){
            if(!w.IsFalling && w.Num==0){
                PeList.push(w.Period);
            }
        })

        if(PeList.length<1)return "";

        let sum=0;
        PeList.forEach(function(pe,i){
            sum+=pe;
        })
        let ave=Math.floor(sum/PeList.length);
        return Year-ave;
    },
    MakeMessage:function(){
        let str
        if(this.CalcAge()==""){
            str="推定年齢を算出中..."
            return str;
        }else{
            str="推定年齢："+this.CalcAge()+"歳";
            return str;
        }
    }
}


//==============================
// 2.main functions
//==============================

window.onload=function(){
    UpdateTimer=setInterval(Update,50);
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
        let NewWord=new Word(ExistWord.length,WordList[index][0],WordList[index][1],i,letter,lef);
        ExistWord.push(NewWord);
    })
}

function WordCleaner(w,i){
    if(w.Top>document.body.clientHeight+HeightMarginBottom && w.IsFalling){
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
    HeightMarginBottom=document.body.clientHeight*1.2;
})

$(document).mousedown(function(e){
    e.preventDefault();
    let index=GetExistIndex(e.target);
    if(index!==""){
        ExistWord[index].MouseDown();
    }
    $("#CalcAgeMessage").text(CalcAgeSystem.MakeMessage());
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
$("#CalcAgeButton").mousedown(function(e){
    if(e.target.getAttribute("isPushed")=="false"){
        e.target.setAttribute("isPushed","true");
        $("#CalcAgeMessage").attr("isDisplayed","true");
        $("#CalcAgeMessage").text(CalcAgeSystem.MakeMessage());
    }else if(e.target.getAttribute("isPushed")=="true"){
        e.target.setAttribute("isPushed","false");
        $("#CalcAgeMessage").attr("isDisplayed","false");
    }
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
    ["あたり前田のクラッカー", 1960],
    ["アッシー",1980],
    ["アベック",1990],
    ["アムラー",1990],
    ["いただきマンモス",1980],
    ["イタ飯",1985],
    ["イベコン",1980],
    ["うれピー",1980],
    ["おけまる",2017],
    ["チョベリグ",1990],
    ["チョベリバ",1990],
    ["花金",1985],
    ["マブダチ",1980],

    ["ルート8",1950],
    ["ぎょうにんべん",1950],
    ["おるぐる",1960],
    ["ナウい",1970],
    ["イモい",1970],
    ["ノースケ",1980],

    ["ポケベル",1990],
    ["いたベル",1990],
    ["おやきり",1990],
    ["ちゃくぎり",1990],
    ["タッキー",1990],
    ["おそろ",1990],

    ["今北産業",2000],
    ["もちつけ",2000],
    ["キボンヌ",2000],
    ["なう",2009],
    ["www",2010],
    ["ググる",2010],
    ["ワンチャン",2010],
    ["はにゃ？",2010],
    ["リムる",2010],
    ["スパダリ",2010],
    ["飛ぶぞ",2010],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],
    ["",20],

    ["アルサロ",1950],
    ["いかれポンチ",1950],
    ["一辺倒",1950],
    ["オー、ミステイク",1950],
    ["とんでもハップン",1950],
    ["チラリズム",1950],
    ["貧乏人は麦を食え",1950],
    ["日曜作家",1950],
    ["親指族",1951],
    ["エントツ",1951],
    ["逆コース",1951],
    ["三等重役",1951],
    ["社用族",1951],
    ["老兵は死なず、ただ消え去るのみ",1951],
    ["GI刈り",1951],
    ["アジャパー",1951],
    ["恐妻",1952],
    ["パンマ",1952],
    ["風太郎",1952],
    ["見てみてみ",1952],
    ["さいざんす",1953],
    ["街頭テレビ",1953],
    ["クルクルパー",1953],
    ["八頭身",1953],
    ["むちゃくちゃでございまするがな",1953],
    ["アプレの犯罪",1954],
    ["イタリアン・ボーイ",1954],
    ["五せる接待",1954],
    ["シャネルの5番",1954],
    ["ロマンスグレー",1954],
    ["押し屋",1955],
    ["三種の神器",1955],
    ["セミテン",1955],
    ["兵隊の位で言うと",1955],
    ["太陽族",1956],
    ["抵抗族",1956],
    ["マネー・ビル",1956],
    ["カックン",1957],
    ["何と申しましょうか",1957],
    ["イカす",1958],
    ["黄色いダイヤ",1958],
    ["シビれる",1958],
    ["団地族",1958],
    ["ながら族",1958],
    ["カミナリ族",1959],
    ["サッチョン族",1959],
    ["タフガイ",1959],
    ["お呼びでない",1961],
    ["現代っ子",1961],
    ["トサカにくる",1961],
    ["ドドンパ",1961],
    ["地球は青かった",1961],
    ["ラリる",1961],
    ["孤独との戦い",1962],
    ["残酷物語",1962],
    ["無責任男",1962],
    ["ハイそれまでよ",1962],
    ["C調",1962],
    ["いい線いってる",1963],
    ["カワイコちゃん",1963],
    ["三ちゃん産業",1963],
    ["カギッ子",1964],
    ["カラ出張",1964],
    ["東京さばく",1964],
    ["シェー",1964],
    ["みゆき族",1964],
    ["やせたソクラテス",1964],
    ["アイビールック",1965],
    ["スモッグ",1965],
    ["ブルーフィルム",1965],
    ["モーテル",1965],
    ["やったるで",1965],
    ["ゴマすり",1966],
    ["こまっちゃうな",1966],
    ["しあわせだなぁ",1966],
    ["シュワッチ",1966],
    ["新三種の神器",1966],
    ["全共闘",1966],
    ["見通し暗いよ",1966],
    ["アングラ",1967],
    ["核家族",1967],
    ["ハイミス",1967],
    ["フーテン族",1967],
    ["五月病",1968],
    ["サイケ",1968],
    ["ズッコケル",1968],
    ["ハレンチ",1968],
    ["もう走れません",1968],
    ["あっと驚くタメゴロー",1969],
    ["オー、モーレツ！",1969],
    ["ニャロメ",1969],
    ["やったぜ、ベイビー",1969],
    ["ウーマン・リブ",1970],
    ["三無主義",1970],
    ["鼻血ブー",1970],
    ["生活かかってる",1970],
    ["アンノン族",1971],
    ["脱サラ",1971],
    ["ニアミス",1971],
    ["ピース、ピース",1971],
    ["お客様は神様です",1972],
    ["三角大福戦争",1972],
    ["バイコロジー",1972],
    ["未婚の母",1972],
    ["うちのカミさんがね",1973],
    ["ストリーキング",1974],
    ["おじゃまむし",1975],
    ["オヨヨ",1975],
    ["死刑！",1975],
    ["中ピ連",1975],
    ["記憶にございません",1976],
    ["はしゃぎすぎ",1976],
    ["フィクサー",1976],
    ["たたりじゃー",1977],
    ["話がピーマン",1977],
    ["アーウー",1978],
    ["ナンチャッテおじさん",1978],
    ["フィーバー",1978],
    ["窓際族",1978],
    ["ウサギ小屋",1979],
    ["エガワる",1979],
    ["キャリア・ウーマン",1979],
    ["公費天国",1979],
    ["シカト",1979],
    ["夕暮れ族",1979],
    ["カラスの勝手でしょ",1980],
    ["竹の子族",1980],
    ["トカゲのしっぽ",1980],
    ["とらばーゆ",1980],
    ["ぶりっ子",1980],
    ["ヘッドホン族",1980],
    ["VSOP",1980],
    ["",1981],
    ["",1981],
    ["",1981],
    ["",1981],
    ["",1981],
    ["",1981],
    ["",1981],
    ["",19],
    ["",19],
    ["",19],
    ["",19],
    ["",19],
    ["",19],
    ["",19],
    ["",19],
    ["",19],
    ["",19],
    ["",19],
    ["",19],
    ["",19],
]
//最近のだと10歳になりかねん