
export default function Home() {
  return (
   <> <main>
   <div id="scrollable">
       <p id="system-message"></p>
       <ul id="messages"></ul>
   </div>
   <form>
       <input type="text" autofocus autocomplete="off"></input>
       <button disabled>Send</button>
       <button id="stop-button" type="button" disabled>🛑</button>
       <button id="settings-button" type="button">⚙️</button>
   </form>
</main>

<dialog>
   <h2>Settings</h2>
   <fieldset>
       <legend>Model Options</legend>
           <div>
               <label for="field-model">Model</label>
               <select name="" id="field-model">
                   <option value="" disabled selected>Select Model</option>
               </select>
           </div>
           <div>
               <label for="field-system-message">System Message</label>
               <input type="text" id="field-system-message" style="width:100%"/>
           </div>
       </fieldset>
   <form method="dialog">
       <button>Close</button>
   </form>
</dialog>

<script type="module" src="/main.js"></script>
</> 
  );
}
