jQuery(function($) {
    $(document).ready(function () {
        let board = Array(9).fill(null);
        let currentPlayer = 'X'; // Player
        let gameActive = true;

        // Retrieve scores from localStorage or initialize to zero
        let playerScore = localStorage.getItem('playerScore') ? parseInt(localStorage.getItem('playerScore')) : 0;
        let computerScore = localStorage.getItem('computerScore') ? parseInt(localStorage.getItem('computerScore')) : 0;

        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        function checkWin() {
            for (const pattern of winPatterns) {
                const [a, b, c] = pattern;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return pattern; // Return the winning pattern
                }
            }
            return null;
        }

        function updateMessage() {
            $('#message').text(currentPlayer === 'X' ? "Your turn" : "Computer's turn");
        }

        function updateScore() {
            $('#playerScore').text(`Your Score: ${playerScore}`);
            $('#computerScore').text(`Computer Score: ${computerScore}`);
            // Save scores to localStorage
            localStorage.setItem('playerScore', playerScore);
            localStorage.setItem('computerScore', computerScore);
        }

        function handleClick(cellIndex) {
            if (gameActive && !board[cellIndex] && currentPlayer === 'X') {
                board[cellIndex] = currentPlayer;

                // Animate the move
                const cell = $(`[data-index=${cellIndex}]`);
                cell.text(currentPlayer);
                cell.css("-webkit-text-stroke", "1px red");
                gsap.fromTo(cell, { scale: 0 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });

                const winningPattern = checkWin();
                if (winningPattern) {
                    gameActive = false;
                    playerScore++; // Increment player score
                    updateScore();
                    updateMessage();
                    animateWinningSequence(winningPattern);
                } else if (!board.includes(null)) {
                    gameActive = false;
                    $('#message').text("It's a tie!");
                } else {
                    currentPlayer = 'O'; // Switch to computer
                    updateMessage();
                    computerMove(); // Computer makes a move
                }
            }
        }

        function computerMove() {
            // Check for a winning move
            for (const pattern of winPatterns) {
                const [a, b, c] = pattern;
                if (board[a] === 'O' && board[b] === 'O' && board[c] === null) {
                    makeMove(c);
                    return;
                } else if (board[a] === 'O' && board[c] === 'O' && board[b] === null) {
                    makeMove(b);
                    return;
                } else if (board[b] === 'O' && board[c] === 'O' && board[a] === null) {
                    makeMove(a);
                    return;
                }
            }

            // Check to block the player from winning
            for (const pattern of winPatterns) {
                const [a, b, c] = pattern;
                if (board[a] === 'X' && board[b] === 'X' && board[c] === null) {
                    makeMove(c);
                    return;
                } else if (board[a] === 'X' && board[c] === 'X' && board[b] === null) {
                    makeMove(b);
                    return;
                } else if (board[b] === 'X' && board[c] === 'X' && board[a] === null) {
                    makeMove(a);
                    return;
                }
            }

            // If no winning/blocking move, choose a random empty cell
            const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
            if (emptyCells.length > 0) {
                const cellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                makeMove(cellIndex);
            }
        }

        function makeMove(cellIndex) {
            board[cellIndex] = currentPlayer;

            // Animate the move
            const cell = $(`[data-index=${cellIndex}]`);
            cell.text(currentPlayer);
            cell.css("-webkit-text-stroke", "1px white");
            gsap.fromTo(cell, { scale: 0 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });

            const winningPattern = checkWin();
            if (winningPattern) {
                gameActive = false;
                computerScore++; // Increment computer score
                updateScore();
                updateMessage();
                animateWinningSequence(winningPattern);
            } else if (!board.includes(null)) {
                gameActive = false;
                $('#message').text("It's a tie!");
            } else {
                currentPlayer = 'X'; // Switch back to player
                updateMessage();
            }
        }

        function animateWinningSequence(winningPattern) {
            const winningCells = winningPattern.map(index => $(`[data-index=${index}]`));
            gsap.fromTo(
                winningCells,
                { scale: 1 },
                {
                    scale: 1.2,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 3,
                    ease: "power2.easeOut",
                }
            );
        }

        $('.cell').on('click', function () {
            const cellIndex = $(this).data('index');
            handleClick(cellIndex);
        });

        $('#reset').on('click', function () {
            // Stop any active GSAP animations
            gsap.killTweensOf(".cell");
            gsap.killTweensOf("#message");

            board = Array(9).fill(null);
            currentPlayer = 'X';
            gameActive = true;
            $('.cell').text('').removeAttr('style');
            $('#message').text("Your turn");

            // Animate the reset button
            gsap.fromTo('#reset', { scale: 1 }, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1, ease: "power1.inOut" });

            // Animate clearing of cells
            gsap.fromTo('.cell', { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.05 });
        });

        // Initialize score display
        updateScore();
        $('#message').text("Your turn");
    });
});
