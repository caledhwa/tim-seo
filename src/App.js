import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';

function App() {

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const columns = [
    { field: 'factor2', headerName: 'Top 2-Word', flex: 1 },
    { field: 'factor3', headerName: 'Top 3-Word', flex: 1 },
    { field: 'factor4', headerName: 'Top 4-Word', flex: 1 },
  ];

  const handleSearch = () => {
    setLoading(true);
    fetch(`/api/gsearch?q=${search}`)
      .then((response) => response.json())
      .then((json) => {
        const factor2Phrases = json.factor2.map(item => item.phrase).slice(0, 20);
        const factor3Phrases = json.factor3.map(item => item.phrase).slice(0, 20);
        const factor4Phrases = json.factor4.map(item => item.phrase).slice(0, 20);

        const combinedData = factor2Phrases.map((item, index) => ({
          id: index,
          factor2: factor2Phrases[index] || '',
          factor3: factor3Phrases[index] || '',
          factor4: factor4Phrases[index] || '',
        }));

        console.log({ combinedData })

        setData(combinedData);
        setLoading(false);
      });
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ['factor2', 'factor3', 'factor4'].join(',');
    csvRows.push(headers);

    for (const row of data) {
      const values = [row.factor2, row.factor3, row.factor4].join(',');
      csvRows.push(values);
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv';
    link.click();
  };

  return (
    <Box mt={2}>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={10}>
          <Box ml={2}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                  e.preventDefault(); // Prevent form submission & page reload
                }
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Grid>
      </Grid>
      {loading && (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
          <Grid item>
            <Box sx={{ mt: 2 }}>
              <CircularProgress />
            </Box>
          </Grid>
        </Grid>
      )}
      {!loading && data.length > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ m: 2 }}>
              <DataGrid rows={data} columns={columns} pageSize={data.length} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ m: 2 }}>
              <Button variant="contained" onClick={exportToCSV}>Export to CSV</Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default App;
