jQuery(function($) {
    $(document).ready(function () {
        let board = Array(9).fill(null);
        let currentPlayer = 'X';
        let gameActive = true;

    
        let scores = JSON.parse(localStorage.getItem('scores')) || [0, 0, 0];
        let [playerScore, computerScore, tieScore] = scores;

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
                    return pattern;
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
            $('#tieScore').text(`Ties: ${tieScore}`);
            localStorage.setItem('scores', JSON.stringify([playerScore, computerScore, tieScore]));
        }

        function handleClick(cellIndex) {
            if (gameActive && !board[cellIndex] && currentPlayer === 'X') {
                board[cellIndex] = currentPlayer;

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
                    tieScore++;
                    updateScore();
                    $('#message').text("It's a tie!");
                } else {
                    currentPlayer = 'O';
                    updateMessage();
                    setTimeout(computerMove, 1000);
                }
            }
        }

        function computerMove() {
        
            let bestMove = findBestMove('O');
            if (bestMove !== null) {
                makeMove(bestMove);
                return;
            }

        
            bestMove = findBestMove('X');
            if (bestMove !== null) {
                makeMove(bestMove);
                return;
            }

        
            const center = 4;
            const corners = [0, 2, 6, 8];
            const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);

        
            if (board[center] === null) {
                makeMove(center);
            } 
        
            else if (corners.some(corner => board[corner] === null)) {
                const availableCorners = corners.filter(corner => board[corner] === null);
                makeMove(availableCorners[Math.floor(Math.random() * availableCorners.length)]);
            } 
        
            else {
                makeMove(emptyCells[Math.floor(Math.random() * emptyCells.length)]);
            }
        }

        function findBestMove(player) {
            for (const pattern of winPatterns) {
                const [a, b, c] = pattern;
                if (
                    (board[a] === player && board[b] === player && board[c] === null) ||
                    (board[a] === player && board[b] === null && board[c] === player) ||
                    (board[a] === null && board[b] === player && board[c] === player)
                ) {
                    return [a, b, c].find(index => board[index] === null);
                }
            }
            return null;
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
                tieScore++;
                updateScore();
                $('#message').text("It's a tie!");
            } else {
                currentPlayer = 'X';
                updateMessage();
            }
        }

        function animateWinningSequence(winningPattern) {
            const winningCells = winningPattern.map(index => $(`[data-index=${index}]`).find('span'));
            gsap.fromTo(
                winningCells,
                { scale: 1 },
                {
                    scale: 1.2,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 3,
                    ease: "power2.easeOut",
                    stagger: 0.15
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
