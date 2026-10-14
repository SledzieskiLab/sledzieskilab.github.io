---
title: "Modeling dynamic allostery"
slug: dynamics
order: 2
image: "structure_dynamics.gif"
blurb: >-
  We model the link between structural heterogeneity and molecular function through the lens of allostery.
papers:
  - sledzieski2026planetmd
  - sledzieski2026landscape
  - kshirsagar2025rapid
---

<!-- ![Various experimental modalities, along with molecular dynamics simulations, contain information that can be used to learn structural heterogeneity.](/assets/images/research/dynamics_experimental.png) -->

Nearly all proteins exhibit some dynamic behavior, adopting an ensemble of structures rather than a single, fixed structure. These dynamics can offer hints to their function, as a shift in conformation often indicates a change in functional state. Specifically, our lab is interested in allosterically mediated interactions, where binding at an off-target site (red, below) induces a conformational change that allows or accelerates binding at a primary site (blue, below).

![Cartoon schematic of allosterically induced binding.](/assets/images/research/allostery_cartoon.png)

We've developed methods for sequence- and structure-based prediction of [allosteric networks in proteins](https://github.com/SledzieskiLab/PLANET-MD), where we can identify subsets of residues that exhibit correlated motion. The lab is working on developing methods to predict binding-induced conformational change, and to improve prediction of protein interactions by conditioning on conformational ensembles and allosteric modulators.

![Allosteric network and communities constructed from predicted correlations in KRAS residue dynamics.](/assets/images/research/allosteric_network.png)

<!-- Contrastive learning across protein and chemical representation spaces lets a single model reason about binding without target-specific training data. We are extending this toward selectivity: not just whether a compound binds, but whether it binds one paralog and not its neighbors. This matters for the difference between an interesting hit and a usable therapeutic. -->
