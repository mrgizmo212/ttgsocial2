param(
    [string]$BaseUrl = "http://localhost:8080"
)

$ErrorActionPreference = "Stop"

Write-Host "SMOKE: BaseUrl = $BaseUrl" -ForegroundColor Cyan

# Helper: GET with optional headers
function Invoke-GetJson {
    param([string]$Url, [hashtable]$Headers)
    if ($Headers) {
        return Invoke-RestMethod -Uri $Url -Method GET -Headers $Headers
    }
    return Invoke-RestMethod -Uri $Url -Method GET
}

# Helper: POST JSON
function Invoke-PostJson {
    param([string]$Url, [object]$BodyObj, [hashtable]$Headers)
    $json = $BodyObj | ConvertTo-Json -Depth 5
    $args = @{ Uri = $Url; Method = 'POST'; ContentType = 'application/json'; Body = $json }
    if ($Headers) { $args.Headers = $Headers }
    return Invoke-RestMethod @args
}

# 1) Auth: demo-signup
Write-Host "SMOKE: POST /api/auth/demo-signup" -ForegroundColor Yellow
$signup = Invoke-RestMethod -Uri "$BaseUrl/api/auth/demo-signup" -Method POST
$token = $signup.token
$authHeaders = @{ Authorization = "Bearer $token" }
Write-Host "Token acquired" -ForegroundColor Green

# 2) Auth: me
Write-Host "SMOKE: GET /api/auth/me" -ForegroundColor Yellow
$me = Invoke-GetJson -Url "$BaseUrl/api/auth/me" -Headers $authHeaders
Write-Host "Authenticated as userId=$($me.id) username=$($me.username)" -ForegroundColor Green

# 3) Users: top-five
Write-Host "SMOKE: GET /api/users/get-top-five" -ForegroundColor Yellow
$top = Invoke-GetJson -Url "$BaseUrl/api/users/get-top-five"
Write-Host "TopFive: $($top -join ',')" -ForegroundColor Green

# 4) Posts: create (text only)
Write-Host "SMOKE: POST /api/posts/create (text)" -ForegroundColor Yellow
$form = @{ text = "smoke-post $(Get-Date -Format o)" }
$postRes = Invoke-RestMethod -Uri "$BaseUrl/api/posts/create" -Method POST -Headers $authHeaders -Form $form
$postId = [int]$postRes.id
Write-Host "Created postId=$postId" -ForegroundColor Green

# 5) Likes: create/delete
Write-Host "SMOKE: POST /api/likes/create|delete" -ForegroundColor Yellow
$likeBody = @{ likedPostId = $postId }
Invoke-PostJson -Url "$BaseUrl/api/likes/create" -BodyObj $likeBody -Headers $authHeaders | Out-Null
Invoke-PostJson -Url "$BaseUrl/api/likes/delete" -BodyObj $likeBody -Headers $authHeaders | Out-Null
Write-Host "Like toggle OK" -ForegroundColor Green

# 6) Bookmarks: create/delete
Write-Host "SMOKE: POST /api/bookmarks/create|delete" -ForegroundColor Yellow
$bmBody = @{ bookmarkedPost = $postId }
Invoke-PostJson -Url "$BaseUrl/api/bookmarks/create" -BodyObj $bmBody -Headers $authHeaders | Out-Null
Invoke-PostJson -Url "$BaseUrl/api/bookmarks/delete" -BodyObj $bmBody -Headers $authHeaders | Out-Null
Write-Host "Bookmark toggle OK" -ForegroundColor Green

# 7) Retweets: create/delete
Write-Host "SMOKE: POST /api/retweets/create|delete" -ForegroundColor Yellow
$rtBody = @{ referenceId = $postId; type = "post" }
Invoke-PostJson -Url "$BaseUrl/api/retweets/create" -BodyObj $rtBody -Headers $authHeaders | Out-Null
Invoke-PostJson -Url "$BaseUrl/api/retweets/delete" -BodyObj $rtBody -Headers $authHeaders | Out-Null
Write-Host "Retweet toggle OK" -ForegroundColor Green

# 8) Follows: follow/unfollow another temp user
Write-Host "SMOKE: POST /api/follows/follow|unfollow" -ForegroundColor Yellow
$other = Invoke-RestMethod -Uri "$BaseUrl/api/auth/demo-signup" -Method POST
$otherId = [int]$other.user.id
$followBody = @{ followedId = $otherId }
Invoke-PostJson -Url "$BaseUrl/api/follows/follow" -BodyObj $followBody -Headers $authHeaders | Out-Null
Invoke-PostJson -Url "$BaseUrl/api/follows/unfollow" -BodyObj $followBody -Headers $authHeaders | Out-Null
Write-Host "Follow toggle OK (target userId=$otherId)" -ForegroundColor Green

# 9) Feed: get-feed-page
Write-Host "SMOKE: GET /api/feed/get-feed-page?type=Tweets&cursor=0&limit=3" -ForegroundColor Yellow
$feed = Invoke-GetJson -Url "$BaseUrl/api/feed/get-feed-page?type=Tweets&cursor=0&limit=3" -Headers $authHeaders
Write-Host "Feed posts: $($feed.posts -join ',') nextCursor=$($feed.nextCursor)" -ForegroundColor Green

# 10) Notifications: get-unseen (and batch retrieval if any)
Write-Host "SMOKE: GET /api/notifications/get-unseen" -ForegroundColor Yellow
$unseen = Invoke-GetJson -Url "$BaseUrl/api/notifications/get-unseen" -Headers $authHeaders
Write-Host "Unseen notification IDs: $($unseen -join ',')" -ForegroundColor Green
if ($unseen -and $unseen.Count -gt 0) {
    $notifDetails = Invoke-PostJson -Url "$BaseUrl/api/notifications/get-notifications" -BodyObj $unseen -Headers $authHeaders
    Write-Host "Fetched $($notifDetails.Count) notifications" -ForegroundColor Green
}

# 11) Users: get-users and search
Write-Host "SMOKE: POST /api/users/get-users" -ForegroundColor Yellow
$users = Invoke-PostJson -Url "$BaseUrl/api/users/get-users" -BodyObj @([int]$me.id, [int]$otherId) -Headers $null
Write-Host "Got $($users.Count) users" -ForegroundColor Green

Write-Host "SMOKE: GET /api/users/search?q=user_" -ForegroundColor Yellow
$search = Invoke-GetJson -Url "$BaseUrl/api/users/search?q=user_"
Write-Host "Search results: $($search -join ',')" -ForegroundColor Green

Write-Host "SMOKE: All steps completed" -ForegroundColor Cyan


