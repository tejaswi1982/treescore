# Level 2 research foundation — no public tree counts

This is a research plan, not an implemented detector. Sentinel-2's nominal 10 m pixels mix crowns, buildings, shadows and ground cover; that is inadequate for reliable individual urban tree counting. Increasing display resolution does not recover missing spatial information.

## Candidate approaches

[DeepForest](https://deepforest.readthedocs.io/en/stable/index.html) provides tree-crown object detection for high-resolution imagery. Evaluate pretrained weights on licensed Mumbai aerial/sub-metre imagery, then locally fine-tune using separate training, validation and held-out neighbourhoods. Pretrained success elsewhere is not evidence of Mumbai accuracy. Bounding boxes are crown candidates, not confirmed individual trees.

[Meta/WRI canopy-height mapping](https://datasets.wri.org/datasets/meta-tree-canopy-height) offers a possible high-resolution vegetation/height prior. A canopy-height raster is not an individual-tree inventory. Check edition, imagery dates, resolution, licensing, coverage and local quality before use; a model-derived height is not a field measurement. WRI describes its [global canopy-map collaboration](https://www.wri.org/outcomes/new-ai-model-maps-every-tree-earth); use the data product's actual documentation rather than equating a headline with validated local counts.

## Validation design

- Obtain lawful high-resolution, dated imagery and record acquisition geometry, ground sampling distance and licence. Tree detection needs imagery finer than the crowns being separated; no universal resolution guarantees accuracy.
- Conduct ground-truth walks in representative streets, parks, mangroves, dense settlements and overlapping canopy. Record consent-aware geotagged observations, image/field dates, crown visibility and uncertainty. Limit access to private-property imagery and precise volunteer traces.
- Have two annotators label a subset. Separate crowns, buildings, shrubs, shadows and uncertain objects; record disagreement rather than force ambiguous labels.
- Split geographically to avoid adjacent-tile leakage. Report detection precision/recall at declared IoU thresholds, counting error per area, performance by setting and confidence calibration. Reserve independent neighbourhoods for final assessment.
- Investigate false positives on rooftop objects, crown overlap, split/merged crowns, occluded understory, seasonal foliage, date mismatch and registration errors. Avoid double-counting overlapping tiles; retain documented suppression/matching parameters.
- Compare with independently verified field observations. Confidence scores describe model output, not proof that an object is a tree. Human acceptance/rejection must be separate from model confidence.

## Future isolated data/API contract

Use a separate versioned research store and route such as `/api/research/tree-candidates` only when implemented. Suggested record: `candidateId`, `analysisAreaId`, `geometry`, `imagerySource`, `imageryDate`, `resolutionMeters`, `license`, `modelVersion`, `confidence`, `reviewStatus` (unreviewed/accepted/rejected/uncertain), `verificationDate`, `verificationMethod`, `crownAreaSqM`, `uncertaintyNote`. Do not infer stem count from crown area or canopy height. Expose aggregate counts only after a documented validation and publication gate. No research endpoint or individual-tree metric is active in the Phase-1 application.

Next experiment: secure suitable imagery and label a small geographically varied held-out set before choosing a model or promising accuracy.
