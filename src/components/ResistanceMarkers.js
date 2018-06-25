function ResistanceMarkers () {
  return (
    <div id="resistance_markers" style={styles.resistance_markers}>

      <div style={styles.resistance_input_row}
           className="title">
        Resistance markers
      </div>


      <div style={styles.resistance_input_row}>

        <label htmlFor={'resistance_spread'}
               style={styles.resistance_spread_label}>
          Spread %
        </label>
        <input id={'resistance_spread'}
               style={Object.assign({}, styles.resistance_input, styles.resistance_spread)}
               type="number"
               step={1}
               value={resistance_spread}
               onChange={this.setResistanceSpread}/>
      </div>

      <div style={styles.resistance_input_row}>

      </div>

      <div style={styles.resistance_input_row}>

        <label htmlFor={'resistance_low'}
               style={styles.resistance_label}>
          Buy
        </label>
        <input id={'resistance_low'}
               style={Object.assign({}, styles.resistance_input, styles.resistance_low)}
               type="number"
               step={inputStep}
               value={resistance_low}
               onChange={this.setResistanceLow}/>

      </div>

      <div style={styles.resistance_input_row}>

        <label htmlFor={'resistance_mid'}
               style={styles.resistance_label}>
          Mid
        </label>
        <input id={'resistance_mid'}
               style={Object.assign({}, styles.resistance_input, styles.resistance_mid)}
               type="number"
               step={inputStep}
               value={resistance_mid}
               onChange={this.setResistanceMid}/>

      </div>

      <div style={styles.resistance_input_row}>

        <label htmlFor={'resistance_high'}
               style={styles.resistance_label}>
          Sell
        </label>
        <input id={'resistance_high'}
               style={Object.assign({}, styles.resistance_input, styles.resistance_high)}
               type="number"
               step={inputStep}
               value={resistance_high}
               onChange={this.setResistanceHigh}/>

      </div>

    </div>
  )
}