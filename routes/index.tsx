export default function Home() {
  return (
    <>
      <main>
        <div id="scrollable">
          <div>
            <p id="system-message"></p>
            <ul id="messages"></ul>
          </div>
        </div>
        <form>
          <div>
            <input type="text" autofocus autocomplete="off"></input>
            <button>Send</button>
            <button id="stop-button" type="button" disabled>🛑</button>
            <button id="delete-button" type="button">🗑️</button>
            <button id="settings-button" type="button">⚙️</button>
          </div>
        </form>
      </main>

      <dialog>
        <h2>Settings</h2>
        <div>
          <label for="field-model">Model</label>
          <select name="" id="field-model">
            <option value="" disabled selected>Select Model</option>
          </select>
        </div>
        <div>
          <label for="field-system-message">System Message</label>
          <textarea id="field-system-message" style="width:100%" rows={3}>
          </textarea>
          {
            /* <div>
            <label htmlFor="field-json">
              <input type="checkbox" id="field-json" />JSON Response
            </label>
          </div> */
          }
          <button id="clear-chat-button" type="button">Clear Chat</button>
        </div>
        <form method="dialog" style="float: right">
          <button>Close</button>
        </form>
      </dialog>

      <script type="module" src="/main.js"></script>
    </>
  );
}
