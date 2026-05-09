import { supabase } from './supabase.js';

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


function colorizeBases(sequence) {
    return sequence.split("").map(base =>
        '<span class="base-' + base + '">' + base + '</span>'
    ).join("");
}

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

const CARDS = ["dna-card", "stats-card", "rna-card", "codons-card", "protein-card"];

function resetDisplay() {
    hideError();
    document.getElementById("results").classList.add("hidden");
    CARDS.forEach(cls => document.querySelector("." + cls).classList.add("hidden"));
}

function parentFunc() {

    resetDisplay();

    let dna = document.getElementById("dnaInput").value;
    dna = dna.trim().toUpperCase();

    if (dna === "") {
        showError("Please enter a DNA sequence");
        return;
    }

    const strandMode = document.querySelector('input[name="strand"]:checked').value;

    let afterTranscription = dnaToRna(dna, strandMode);
    if (!afterTranscription.ok) {
        showError(afterTranscription.error);
        return;
    }

    // Stage 1: DNA is valid — show DNA card and Stats card
    const dist = calculateBaseDistribution(dna);
    const gc = calculateGCContent(dna);
    document.getElementById("dnaResult").innerHTML = colorizeBases(dna);
    document.getElementById("statsResult").innerHTML =
        '<div class="stat-item"><span class="stat-label">GC%</span><span class="stat-value">' + gc + '%</span></div>' +
        '<span class="stat-divider">|</span>' +
        '<div class="stat-item"><span class="stat-label base-A">A</span><span class="stat-value">' + dist.A + '</span></div>' +
        '<div class="stat-item"><span class="stat-label base-T">T</span><span class="stat-value">' + dist.T + '</span></div>' +
        '<div class="stat-item"><span class="stat-label base-C">C</span><span class="stat-value">' + dist.C + '</span></div>' +
        '<div class="stat-item"><span class="stat-label base-G">G</span><span class="stat-value">' + dist.G + '</span></div>';
    document.querySelector(".dna-card").classList.remove("hidden");
    document.querySelector(".stats-card").classList.remove("hidden");
    document.getElementById("results").classList.remove("hidden");

    const frame = parseInt(document.querySelector('input[name="frame"]:checked').value);

    let splitResult = splitCodons(afterTranscription.rna, frame);
    if (!splitResult.ok) {
        showError(splitResult.error);
        return;
    }

    // Stage 2: Codon analysis succeeded — show RNA, Codons, Protein cards
    let protein = codonsToProtein(splitResult.codons);
    document.getElementById("rnaResult").innerHTML = colorizeBases(afterTranscription.rna);
    const codonsHtml = splitResult.codons.map(codon => {
        const amino = codonTable[codon] === "STOP" ? "*" : codonTable[codon];
        return '<div class="codon-box"><div class="codon">' + colorizeBases(codon) + '</div><div class="amino">' + amino + '</div></div>';
    }).join("");
    document.getElementById("codonsResult").innerHTML = codonsHtml;
    document.getElementById("proteinResult").textContent = protein;
    document.querySelector(".rna-card").classList.remove("hidden");
    document.querySelector(".codons-card").classList.remove("hidden");
    document.querySelector(".protein-card").classList.remove("hidden");

}

function dnaToRna(dna, strandMode) {

    let rna = "";

    for (let i = 0; i < dna.length; i++) {

        if (strandMode === "template") {
            if (dna[i] === "A") rna += "U";
            else if (dna[i] === "T") rna += "A";
            else if (dna[i] === "C") rna += "G";
            else if (dna[i] === "G") rna += "C";
            else return { ok: false, error: "Invalid DNA base: " + dna[i] };
        } else {
            if (dna[i] === "A") rna += "A";
            else if (dna[i] === "T") rna += "U";
            else if (dna[i] === "C") rna += "C";
            else if (dna[i] === "G") rna += "G";
            else return { ok: false, error: "Invalid DNA base: " + dna[i] };
        }

    }

    return { ok: true, rna: rna };
}


function splitCodons(rna, frame){

    let codons = [];
    let start;

    if (frame === 1) {
        start = rna.indexOf("AUG");
        if (start === -1) {
            return { ok: false, error: "Missing start codon AUG" };
        }
    } else {
        start = frame - 1;
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

function calculateGCContent(dna) {
    let gc = 0;
    for (let i = 0; i < dna.length; i++) {
        if (dna[i] === "G" || dna[i] === "C") gc++;
    }
    return parseFloat((gc / dna.length * 100).toFixed(1));
}

function calculateBaseDistribution(dna) {
    let dist = { A: 0, T: 0, C: 0, G: 0 };
    for (let i = 0; i < dna.length; i++) {
        dist[dna[i]]++;
    }
    return dist;
}

document.getElementById("analyzeBtn").addEventListener("click", parentFunc);

document.getElementById("loadExampleBtn").addEventListener("click", function() {
    document.getElementById("dnaInput").value = "ATGAAATAG";
});

document.querySelectorAll(".copy-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
        const targetId = btn.dataset.target;
        let text;
        if (targetId === "codonsResult") {
            text = Array.from(document.querySelectorAll("#codonsResult .codon"))
                .map(function(el) { return el.textContent; }).join(" ");
        } else {
            text = document.getElementById(targetId).textContent;
        }
        navigator.clipboard.writeText(text).then(function() {
            btn.textContent = "Copied!";
            setTimeout(function() { btn.textContent = "Copy"; }, 1000);
        });
    });
});
