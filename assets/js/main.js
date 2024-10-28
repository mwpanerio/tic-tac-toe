jQuery(function($) {
    $(document).ready(function () {
        let board = Array(9).fill(null);
        let currentPlayer = 'X';
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
            localStorage.setItem('playerScore', playerScore);
            localStorage.setItem('computerScore', computerScore);
        }

        function handleClick(cellIndex) {
            if (gameActive && !board[cellIndex] && currentPlayer === 'X') {
                board[cellIndex] = currentPlayer;

                // Animate the move with a span wrapper
                const cell = $(`[data-index=${cellIndex}]`);
                cell.html(`<span>${currentPlayer}</span>`);
                cell.css("-webkit-text-stroke", "2px red");
                gsap.fromTo(cell.find('span'), { scale: 0 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });

                const winningPattern = checkWin();
                if (winningPattern) {
                    gameActive = false;
                    playerScore++;
                    updateScore();
                    updateMessage();
                    animateWinningSequence(winningPattern);
                } else if (!board.includes(null)) {
                    gameActive = false;
                    $('#message').text("It's a tie!");
                } else {
                    currentPlayer = 'O';
                    updateMessage();
                    setTimeout(computerMove, 1000);
                }
            }
        }

        function computerMove() {
            // Check for a winning move or block player's winning move
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

            // Block player winning moves
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

            const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
            if (emptyCells.length > 0) {
                const cellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                makeMove(cellIndex);
            }
        }

        function makeMove(cellIndex) {
            board[cellIndex] = currentPlayer;

            const cell = $(`[data-index=${cellIndex}]`);
            cell.html(`<span>${currentPlayer}</span>`);
            cell.css("-webkit-text-stroke", "2px white");
            gsap.fromTo(cell.find('span'), { scale: 0 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });

            const winningPattern = checkWin();
            if (winningPattern) {
                gameActive = false;
                computerScore++;
                updateScore();
                updateMessage();
                animateWinningSequence(winningPattern);
            } else if (!board.includes(null)) {
                gameActive = false;
                $('#message').text("It's a tie!");
            } else {
                currentPlayer = 'X';
                updateMessage();
            }
        }

        function animateWinningSequence(winningPattern) {
            const winningCells = winningPattern.map(index => $(`[data-index=${index}]`).find('span'));
            console.log(winningCells);
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
            gsap.killTweensOf(".cell");
            gsap.killTweensOf("#message");

            board = Array(9).fill(null);
            currentPlayer = 'X';
            gameActive = true;
            $('.cell').html('').removeAttr('style');
            $('#message').text("Your turn");

            gsap.fromTo('#reset', { scale: 1 }, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1, ease: "power1.inOut" });
            gsap.fromTo('.cell', { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.05 });
        });

        updateScore();
        $('#message').text("Your turn");
    });
});