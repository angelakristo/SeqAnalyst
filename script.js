// console.log("SeqAnalyst working!");

const codonTable = {

    "UUU":"F", "UUC":"F", "UUA":"L", "UUG":"L",
    "UCU":"S", "UCC":"S", "UCA":"S", "UCG":"S",
    "UAU":"Y", "UAC":"Y", "UAA":"STOP", "UAG":"STOP",
    "UGU":"C", "UGC":"C", "UGA":"STOP", "UGG":"W",

    "CUU":"L", "CUC":"L", "CUA":"L", "CUG":"L",
    "CCU":"P", "CCC":"P", "CCA":"P", "CCG":"P",
    "CAU":"H", "CAC":"H", "CAA":"Q", "CAG":"Q",
    "CGU":"R", "CGC":"R", "CGA":"R", "CGG":"R",

    "AUU":"I", "AUC":"I", "AUA":"I", "AUG":"M",
    "ACU":"T", "ACC":"T", "ACA":"T", "ACG":"T",
    "AAU":"N", "AAC":"N", "AAA":"K", "AAG":"K",
    "AGU":"S", "AGC":"S", "AGA":"R", "AGG":"R",

    "GUU":"V", "GUC":"V", "GUA":"V", "GUG":"V",
    "GCU":"A", "GCC":"A", "GCA":"A", "GCG":"A",
    "GAU":"D", "GAC":"D", "GAA":"E", "GAG":"E",
    "GGU":"G", "GGC":"G", "GGA":"G", "GGG":"G"

};


function showError(message) {
    const el = document.getElementById("errorMessage");
    el.textContent = message;
    el.classList.remove("hidden");
}

function hideError() {
    const el = document.getElementById("errorMessage");
    el.textContent = "";
    el.classList.add("hidden");
}

function parentFunc() {

    let dna = document.getElementById("dnaInput").value;
    dna = dna.trim().toUpperCase();

    if (dna === "") {
        showError("Please enter a DNA sequence");
        return;
    }

    let afterTranscription = dnaToRna(dna);
    if (!afterTranscription.ok) {
        showError(afterTranscription.error);
        return;
    }

    hideError();

    let splitResult = splitCodons(afterTranscription.rna);
    if (!splitResult.ok) {
        showError(splitResult.error);
        document.getElementById("results").classList.add("hidden");
        return;
    }
    let protein = codonsToProtein(splitResult.codons);

    document.getElementById("dnaResult").textContent = dna;
    document.getElementById("rnaResult").textContent = afterTranscription.rna;
    document.getElementById("codonsResult").textContent = splitResult.codons.join(" ");
    document.getElementById("proteinResult").textContent = protein;
    document.getElementById("results").classList.remove("hidden");

}

function dnaToRna(dna) {

    let rna = "";

    for (let i = 0; i < dna.length; i++) {

        if (dna[i] === "A") rna += "A";
        else if (dna[i] === "T") rna += "U";
        else if (dna[i] === "C") rna += "C";
        else if (dna[i] === "G") rna += "G";
        else {
            return { ok: false, error: "Invalid DNA base: " + dna[i] };
        }

    }

    return { ok: true, rna: rna };
}


function splitCodons(rna){

    let codons = [];

    // let lowerCaseRna = rna.toLowerCase();

    let start = rna.indexOf("AUG");

    // if(start === -1) return codons;
    if(start === -1){
        return { ok: false, error: "Missing start codon AUG" };
    }

    if((rna.length - start) % 3 !== 0){
        console.log("Last nucleotide ignored because it does not form a complete codon.");
    }

    for(let i = start; i < rna.length; i += 3){

        let codon = rna.substring(i, i + 3);

        if(codon.length < 3) break;

        codons.push(codon);

        if (codon === "UAA" || codon === "UAG" || codon === "UGA") break;

    }

    return { ok: true, codons: codons };
}

function codonsToProtein(codons){

    let protein = "";

    for(let codon of codons){

        let amino = codonTable[codon];

        if(amino === "STOP") break;

        if(amino) protein += amino;
    }

    return protein;

}

document.getElementById("loadExampleBtn").addEventListener("click", function() {
    document.getElementById("dnaInput").value = "ATGCGGTAA";
});
