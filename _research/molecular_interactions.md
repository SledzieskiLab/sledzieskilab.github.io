---
title: "Predicting molecular interactions"
slug: interactions
order: 3
image: "molecular_interactions.png"
blurb: >-
  We build models for rapid and accurate prediction of protein-protein interaction networks.
papers:
  - ullanat2026learning
  - schaffer2025memoryefficient
  - sledzieski2023tt3d
  - singh2022topsyturvy
  - sledzieski2021dscript

---

Interactions are the fundamental unit of cellular function. Nearly all molecular function is mediated through protein interactions, yet
protein interaction networks remain incomplete and methods for interaction prediction struggle to generalize broadly.

![Schematic of MINT, predicting PPI directly in a language model.](/assets/images/research/mint_schematic.jpg)

We specialize in developing machine learning methods for high-throughput and accurate protein interaction prediction, and have found success using protein language models and other unsupervised representation methods for this task. Towards this end, we have developed [interpretable deep learning models](https://github.com/SledzieskiLab/D-SCRIPT) and [interaction language models](https://github.com/VarunUllanat/mint) that directly build interaction into the pre-training stage. We aim to push the frontier of these models in terms of throughput, interpretability, and accuracy.

![Cartoon of different interaction networks in different tissues.](/assets/images/research/tissue_networks.png)

Interaction networks are not necessarily the same in every tissue or
cell type. The proteins present, and the interactions they participate
in, can vary with cellular context. The lab is currently interested in combining sequence-based interaction predictions with tissue- and cell-type information to distinguish shared interactions from context-specific ones, and to better understand how cellular functions differ across diverse cellular settings.
