# [VRDG-41](https://monsanto.aha.io/features/VRDG-41)

For this ticket, there were a number of QGIs in Non Prod that had subsampling enabled without repetitions enabled.

Read from a CSV file containing 3 columns (see the sample CSV file VRDG-41.csv):

1. QGI
2. Business Unit
3. Keep Sub Sampling

For each QGI and Business unit, if the 3rd column was marked as yes, then enable repetitions for that Business Unit. If the 3rd column was marked as no, then disable subsampling for that Business Unit.
