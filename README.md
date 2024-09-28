# Habit Tracker PWA

A simple Progressive Web App (PWA) to track daily habits, specifically <strong>Exercise</strong> and <strong>Walking</strong>. The app features a hexagonal calendar grid for six months, allowing users to mark habits as completed by interacting with the respective halves of each hexagon. It runs locally, works offline, and stores data using IndexedDB.</p>
    
## Features
- Track Two Habits:</strong> Exercise and Walking.
- Hexagonal Day Cells:</strong> Each day is represented by a hexagon divided into two equal parts for each habit.
- Toggle Completion:</strong> Click to select or deselect habit completion.
- Local Data Storage:</strong> Uses IndexedDB to persist data locally.
- Offline Functionality:</strong> Fully functional without an internet connection.
- Responsive Design:</strong> Optimized for desktop use.
    
# Installation
    
## Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge).
- - A local server to serve the application files.
    </ul>
    
    <h3>Steps</h3>
    <ol>
        <li><strong>Clone the Repository</strong>
            <pre><code>git clone https://github.com/yourusername/habit-tracker-pwa.git</code></pre>
        </li>
        <li><strong>Navigate to the Project Directory</strong>
            <pre><code>cd habit-tracker-pwa</code></pre>
        </li>
        <li><strong>Serve the Application</strong>
            <p>PWAs require serving over HTTPS or localhost. You can use one of the following methods:</p>
            <ul>
                <li><strong>Using VS Code Live Server Extension</strong>
                    <ul>
                        <li>Install the <a href="https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer">Live Server</a> extension in Visual Studio Code.</li>
                        <li>Open the project folder in VS Code.</li>
                        <li>Right-click on <code>index.html</code> and select <strong>"Open with Live Server"</strong>.</li>
                    </ul>
                </li>
                <li><strong>Using Python's SimpleHTTPServer</strong>
                    <ul>
                        <li><strong>For Python 3:</strong>
                            <pre><code>python -m http.server 8000</code></pre>
                        </li>
                        <li><strong>For Python 2:</strong>
                            <pre><code>python -m SimpleHTTPServer 8000</code></pre>
                        </li>
                        <li>Open your browser and navigate to <code>http://localhost:8000</code>.</li>
                    </ul>
                </li>
                <li><strong>Using Node.js <code>http-server</code></strong>
                    <ul>
                        <li>Install <code>http-server</code> globally if you haven't already:
                            <pre><code>npm install -g http-server</code></pre>
                        </li>
                        <li>Run the server:
                            <pre><code>http-server</code></pre>
                        </li>
                        <li>Open your browser and go to the provided local address (e.g., <code>http://127.0.0.1:8080</code>).</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li><strong>Install as a PWA (Optional)</strong>
            <ul>
                <li>In Chrome, you should see an install prompt or a "+" icon in the address bar. Click it to install the app.</li>
                <li>Once installed, you can run the app like a standalone desktop application.</li>
            </ul>
        </li>
    </ol>
    
    <h2>Usage</h2>
    <ul>
        <li><strong>Marking Habits:</strong>
            <ul>
                <li>Click on the <strong>blue</strong> half of a hexagon to mark <strong>Exercise</strong> as completed. The color changes to a darker blue.</li>
                <li>Click on the <strong>green</strong> half to mark <strong>Walking</strong> as completed. The color changes to a darker green.</li>
                <li>Click again on a completed habit half to deselect it, reverting to the original light color.</li>
            </ul>
        </li>
        <li><strong>Data Persistence:</strong>
            <ul>
                <li>All habit selections are saved locally using IndexedDB.</li>
                <li>Refreshing the page or reopening the app will retain your habit tracking data.</li>
            </ul>
        </li>
        <li><strong>Offline Access:</strong>
            <ul>
                <li>After the initial load, the app remains fully functional without an internet connection.</li>
            </ul>
        </li>
    </ul>
    
    <h2>Project Structure</h2>
    <pre><code>habit-tracker/
│
├── index.html         # Main HTML file
├── styles.css         # CSS styles
├── app.js             # JavaScript functionality
├── manifest.json      # PWA manifest
└── service-worker.js  # Service Worker for offline support
</code></pre>
    
    <h2>Technologies Used</h2>
    <ul>
        <li><strong>HTML5 & CSS3:</strong> For structuring and styling the application.</li>
        <li><strong>JavaScript:</strong> For interactive functionality and data management.</li>
        <li><strong>IndexedDB:</strong> For local NoSQL data storage.</li>
        <li><strong>Service Workers:</strong> To enable offline capabilities.</li>
        <li><strong>PWA Standards:</strong> For installable and reliable web app features.</li>
    </ul>
    
    <h2>Contributing</h2>
    <p>Contributions are welcome! Please follow these steps:</p>
    <ol>
        <li><strong>Fork the Repository</strong></li>
        <li><strong>Create a New Branch</strong>
            <pre><code>git checkout -b feature/YourFeatureName</code></pre>
        </li>
        <li><strong>Commit Your Changes</strong>
            <pre><code>git commit -m "Add some feature"</code></pre>
        </li>
        <li><strong>Push to the Branch</strong>
            <pre><code>git push origin feature/YourFeatureName</code></pre>
        </li>
        <li><strong>Open a Pull Request</strong></li>
    </ol>
    
    <h2>License</h2>
    <p>This project is licensed under the <a href="LICENSE">MIT License</a>.</p>
    
    <h2>Acknowledgements</h2>
    <ul>
        <li>Inspired by the need for a simple and efficient habit tracking tool.</li>
        <li>Thanks to the developers and contributors of the technologies used in this project.</li>
    </ul>
</body>
</html>
